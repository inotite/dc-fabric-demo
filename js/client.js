(function() {
  var canvas = new fabric.Canvas('canvas');
  
  canvas.backgroundColor='#aaa';
  
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.setWidth(document.getElementById('canva-row').offsetWidth );
    // console.log(document.getElementById('canva-row').offsetWidth);
  }
  resizeCanvas();
  
  initAligningGuidelines(canvas);
  
  canvas.observe('object:modified', function (e) {
    var activeObject = e.target;
    activeObject.straighten(45);
    
  });

  // load image from menu to canva
  $('.menu > img').on('click', function (){
    drawObject(this.src);
  })

  function drawObject(imageSrc) {
    fabric.Image.fromURL(imageSrc, function (oImg) {
      // scale image down before adding it onto canvas
      canvas.add(oImg.set({ left : 110, top: 110}).scale(0.5));
    });
  }

  // save image to png
  $('#saveToPng').on('click', function (){
    //var group = new fabric.Group(canvas.getObjects());
    canvas.setActiveGroup(new fabric.Group(canvas.getObjects())).renderAll();

    var cropZone = canvas.getActiveGroup();
    
    // dont save select helper
    canvas.discardActiveObject().renderAll();
    canvas.discardActiveGroup().renderAll();

    var cropDestination = document.createElement('canvas');
    var context = cropDestination.getContext('2d');
    cropDestination.width = cropZone.width + 60;
    cropDestination.height = cropZone.height + 60;
    
    var cropSourceLeft = cropZone.left - (cropZone.width / 2) - 30;
    var cropSourceTop = cropZone.top - (cropZone.height / 2) - 30;

    if(cropSourceLeft < 0){
      cropSourceLeft = 0;
    }
    if(cropSourceTop < 0){
      cropSourceTop = 0;
    }

    context.drawImage(
      canvas.getElement(),
      cropSourceLeft,
      cropSourceTop,
      cropZone.width + 60,
      cropZone.height + 60,
      0,
      0,
      cropZone.width + 60,
      cropZone.height + 60
    );

    Canvas2Image.saveAsJPEG(cropDestination);
  });

  // delete selected object
  $('#delete').on('click', function (){
    canvas.remove(canvas.getActiveObject());
  });

  // add text to canva
  $('#addText').on('click', function (){
    var text = new fabric.Text($('#canvaText').val(), {left : 210, top: 110});
    canvas.add(text);
  });


  // Init color pickers
  $('#team-name').spectrum({
    showPaletteOnly: true,
    showPalette:true,
    color: 'blanchedalmond',
    palette: [
        ['black', 'white', 'blanchedalmond',
        'rgb(255, 128, 0);', 'hsv 100 70 50'],
        ['red', 'yellow', 'green', 'blue', 'violet']
    ]
  });

  $('#escape-label').spectrum({
    color: 'white'
  });

  $('#escape-room').spectrum({
    color: 'violet'
  });
  $('#escape-time').spectrum({
    color: 'yellow'
  });
  $('#highlights').spectrum();

  // Upload a Photo

  $('#uploadPhoto').click(function(){
    $('#file').click();
  });

  $('#file').change(function(){
    if (this.files && this.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            // console.log(e.target.result);
            fabric.Image.fromURL(e.target.result, function(oImg) {
              oImg.scaleX = canvas.width/oImg.width;
              oImg.scaleY = canvas.height/oImg.height;
              oImg.setCoords();
              
              oImg.selectable = false;
              canvas.add(oImg);
            });
        };

        reader.readAsDataURL(this.files[0]);
    }
  });

})();
