jQuery(".serverpara").hide(); //Hide the paragraphs
 var avgTime = []; //We're going to push the server response time in ms here.
 var i = 0;
 function add(a,b){ //We'll need this to add all the items from the avgTime array
   return a+b;
 }
 function serverStatus(){
   jQuery('#server').text("Loading " + Math.round((i/10)*100) + "%").removeClass().addClass('load'); //Loading Text. Basically shows percentages when i++
   if(i < 10){
     ping('https://pgorelease.nianticlabs.com/plfe/').then(function(delta){ //This is the url that reddit found
       avgTime.push(delta); //Pushes server response time in ms to array
       i++;
       serverStatus(); //recur
     }).catch(function(err){ //This means server is down or something
       avgTime.push(3500); //Push 3500ms load speed if not reachable.
       i++;
       serverStatus(); //recur
     });
   }
   if(i == 10){ //When we reach 10 iterations,
     var pinged = avgTime.reduce(add,0) / avgTime.length; //the average of all the response times. Uses pingjs to get server response time
     if(pinged < 800){ //800 ms should state up
       jQuery('#server').text("Up");
       jQuery('#server').removeClass().addClass('up');
       jQuery('#up').show();
     }
     else if(pinged > 800 && pinged < 3000){ //Server is slow
       jQuery('#server').text("Slow");
       jQuery('#server').removeClass().addClass('slow');
       jQuery('#slow').show();
     }
     else if(pinged > 3000){ //Server is prob down
       jQuery('#server').text("Down");
       jQuery('#server').removeClass().addClass('down');
       jQuery('#down').show();
     }
     else{
       jQuery('#server').text("Unreachable");
       jQuery('#server').removeClass().addClass('down');
       jQuery('#down').show();
     }
   }
 }
 serverStatus();
 jQuery('.refresh').bind('click',function(){ //Refresh button
   jQuery(".serverpara").hide();
   i = 0;
   serverStatus();
 });
