(function() {

  const containerPadding = 30;
  const canvasHeight = 200;

  var canvas = new fabric.Canvas('canvas');

  fabric.Object.prototype.hide = function() {
    this.set({
      opacity: 0,
      selectable: false
    });
  };
  
  fabric.Object.prototype.show = function() {
    this.set({
      opacity: 1,
      selectable: false
    });
  };

  var rates = [];

  // Flags here
  var empty = true; // shows the canvas is empty
  var photo_rate;

  var fl_show_time = 1;  // determine if you are gonna show the Escape Time
  var fl_show_team_name = 1; // determine if you are gonna show the Team Name
  var fl_show_room_name = 1; // determine if you are gonna show the Room Name

  var fl_time_created = false;
  var fl_team_name_created = false;
  var fl_room_name_created = false;
  var fl_escape_label_created = false;

  var gb_time;
  var gb_teamName;
  var gb_roomName;
  var gb_escapeLabel;

  var cl_team_name_def = 'rgb(255, 128, 0)';
  var cl_room_name_def = 'yellow';
  var cl_time_def = 'white';

  var color_palette = [['black', 'white', 'blanchedalmond', 'rgb(255, 128, 0);', 'hsv 100 70 50'], ['red', 'yellow', 'green', 'blue', 'violet']];
  
  canvas.backgroundColor='#aaa';
  
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    var width = $('#canva-row')[0].offsetWidth - containerPadding;
    var height = (empty ? canvasHeight : canvas.height);
    var rate = (empty ? 1 : photo.height / photo.width );

    console.log( "Empty : " + empty );
    if (!empty) {
      var dheight = height - rate * width;
      var dwidth = dheight / rate;

      var drate = width / (width + dwidth);

      console.log("Delta width: " + dwidth);
      console.log("Delta Height: " + dheight);
      console.log("Delta rate: " + drate);
      
      var i = 0;
      canvas.getObjects().forEach(element => {
        console.log( "Rates : " + rates[i]);
        console.log( "Scale : " + rates[i] * drate);
        element.scale( rates[i++] *= drate );
        console.log("Element left: " + element.left);
        console.log("Element top: " + element.top);
        element.set( { left: element.left * drate } );
        element.set( { top: element.top * drate } );
        console.log("Element left: " + element.left);
        console.log("Element top: " + element.top);
      });

      // photo.scale( photo_rate * drate );
      // canvas.setBackgroundImage(photo);
    }

    height = rate * width;

    canvas.setWidth( width );
    canvas.setHeight( height );

    canvas.renderAll();
  }

  resizeCanvas();
  
  // initAligningGuidelines(canvas);
  
  canvas.observe('object:modified', function (e) {
    var activeObject = e.target;
    activeObject.straighten(45);
    console.log(e);
  });

  // load image from menu to canva
  $('.menu > img').on('click', function (){
    drawObject(this.src);
  })

  function drawObject(imageSrc) {
    fabric.Image.fromURL(imageSrc, function (oImg) {
      // scale image down before adding it onto canvas
      oImg.set({left: 0, top: 0});
      oImg.scale( canvas.width / oImg.width / 4 );
      rates.push( canvas.width / oImg.width / 4 );

      oImg.set({
        borderColor: 'red',
        cornerColor: 'green',
        cornerSize: 10
      });

      oImg.on('scaling', function(options) {
        var i = 0;
        canvas.getObjects().forEach(element => {
          if (element == oImg) {
            rates[i] = oImg.scaleX;
            return;
          }
          i++;
        });
      });

      canvas.add(oImg);
    });
  }

  function debugBase64(base64URL){
    var win = window.open();
    win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }


  // save image to png
  $('#saveToPng').on('click', function (){
    if (empty) {
      swal("Add your photo first", "No overlay yet ...", "error");
      return;
    }
    // canvas.discardActiveObject();
    photo.hide();
    debugBase64(canvas.toDataURL({format: 'png'})); 
    photo.show();
    photo.selectable = false;
    canvas.renderAll();
    // console.log(canvas.toDataURL({format: 'jpeg'}));
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

  // Create California State Escape Logo

  function createLogo() {
    fabric.Image.fromURL('img/template/logo.png', function(oImg) {
      oImg.set( { left: 10, top: 10 } );
      oImg.selectable = false;

      rates.push(canvas.width / oImg.width / 3 );
      oImg.scale(canvas.width / oImg.width / 3);

      canvas.add(oImg);
    });
  }

  function createTime() {

    var time = new fabric.Text("59:13", {
      left: canvas.width / 2,
      top: canvas.height - 50,
      fontSize: 100,
      fontWeight: 'bold',
      shadow: 'rgba(0, 0, 0, 0.3) 5px 5px 5px',
      fill: $('#time-color').spectrum("get").toHexString(),
      originX: 'center',
      selectable: false,
    });

    fl_time_created = true;
    gb_time = time;
    if ( fl_show_time == 0 )
    gb_time.hide();

    rates.push(canvas.width / gb_time.width / 7);
    gb_time.scale(canvas.width / gb_time.width / 7);
    canvas.add(gb_time);
  }

  function createTeamName() {

    var teamName = new fabric.Text($('#team-name').val(), {
      left: canvas.width / 2,
      top: canvas.height - 120,
      fontSize: 100,
      fontWeight: 'bold',
      shadow: 'rgba(0, 0, 0, 0.3) 5px 5px 5px',
      fill: $('#team-name-color').spectrum("get").toHexString(),
      originX: 'center',
      selectable: false,
    });

    fl_team_name_created = true;
    gb_teamName = teamName;
    if ( fl_show_team_name == 0 )
    gb_teamName.hide();

    rates.push(canvas.width / gb_teamName.width / 3);
    gb_teamName.scale(canvas.width / gb_teamName.width / 3);
    canvas.add(gb_teamName);
  }

  function createRoomName() {

    var roomName = new fabric.Text($('#room-name').val(), {
      left: canvas.width / 2,
      top: canvas.height - 80,
      fontSize: 30,
      fontWeight: 'bold',
      shadow: 'rgba(0, 0, 0, 0.3) 5px 5px 5px',
      fill: $('#room-name-color').spectrum("get").toHexString(),
      originX: 'center',
      selectable: false,
    });

    fl_room_name_created = true;
    gb_roomName = roomName;
    if ( fl_show_room_name == 0 )
    gb_roomName.hide();

    rates.push(canvas.width / gb_roomName.width / 3);
    gb_roomName.scale(canvas.width / gb_roomName.width / 3);
    canvas.add(gb_roomName);
  }

  function createSocialLink() {
    fabric.Image.fromURL('img/template/facebook.png', function(oImg) {
      oImg.set( { left: canvas.width - 50, top: canvas.height - 50 } );
      oImg.selectable = false;

      rates.push(canvas.width / oImg.width / 20 );
      oImg.scale(canvas.width / oImg.width / 20);

      canvas.add(oImg);
    });
    fabric.Image.fromURL('img/template/instagram.png', function(oImg) {
      oImg.set( { left: canvas.width - 80, top: canvas.height - 50 } );
      oImg.selectable = false;

      rates.push(canvas.width / oImg.width / 20 );
      oImg.scale(canvas.width / oImg.width / 20);

      canvas.add(oImg);
    });
    fabric.Image.fromURL('img/template/linkedin.png', function(oImg) {
      oImg.set( { left: canvas.width - 110, top: canvas.height - 50 } );
      oImg.selectable = false;

      rates.push(canvas.width / oImg.width / 20 );
      oImg.scale(canvas.width / oImg.width / 20);

      canvas.add(oImg);
    });

    var siteLink = new fabric.Text("www.californiastateescape.com", {
      left: canvas.width - 20,
      top: canvas.height - 20,
      fontSize: 30,
      fontWeight: 'bold',
      shadow: 'rgba(0, 0, 0, 0.3) 5px 5px 5px',
      fill: '#fff',
      originX: 'right',
      selectable: false,
    });

    rates.push(canvas.width / siteLink.width / 3);
    siteLink.scale(canvas.width / siteLink.width / 3);
    canvas.add(siteLink);
  }

  // Init color pickers
  $('#team-name-color').spectrum({
    showPaletteOnly: true,
    showPalette:true,
    color: cl_team_name_def,
    palette: color_palette,
    change: function(color) {
      if ( fl_team_name_created ) {
        gb_teamName.set( { fill: color.toHexString() } );
        canvas.renderAll();
      }
    }
  });

  $('#escape-label').spectrum({
    showPaletteOnly: true,
    showPalette:true,
    color: 'violet',
    palette: color_palette,
    change: function(color) {
    }
  });

  $('#room-name-color').spectrum({
    showPaletteOnly: true,
    showPalette:true,
    color: cl_room_name_def,
    palette: color_palette,
    change: function(color) {
      if ( fl_room_name_created ) {
        gb_roomName.set( { fill: color.toHexString() } );
        canvas.renderAll();
      }
    }
  });

  $('#time-color').spectrum({
    showPaletteOnly: true,
    showPalette:true,
    color: cl_time_def,
    palette: color_palette,
    change: function(color) {
      if ( fl_time_created ) {
        gb_time.set( { fill: color.toHexString() } );
        canvas.renderAll();
      }
    }
  });

  $('#highlights').spectrum({
    showPaletteOnly: true,
    showPalette:true,
    color: 'black',
    palette: color_palette,
    change: function(color) {
    }
  });

  // Reset All Colors

  $('#reset-all').click(function() {
    $('#team-name-color').spectrum("set", cl_team_name_def);
    $('#room-name-color').spectrum("set", cl_room_name_def);
    $('#time-color').spectrum("set", cl_time_def);
  });

  // Select Room Name

  $('#room-name').change(function() {
    if (fl_room_name_created) {
      gb_roomName.text = $(this).val();
      canvas.renderAll();
    }
  });

  // Select Team Name

  $('#team-name').change(function() {
    if (fl_team_name_created) {
      gb_teamName.text = $(this).val();
      canvas.renderAll();
    }
  });

  // Hide / Show Escape time

  $(":input[name='time']").click(function() {
    fl_show_time = $(this)[0].value;

    if (fl_time_created ) {
      if ( fl_show_time == 1 )
        gb_time.show();
      else
        gb_time.hide();
      canvas.renderAll();
    }
    
  });

  $(":input[name='name']").click(function() {
    fl_show_team_name = $(this)[0].value;

    if (fl_team_name_created) {
      if ( fl_show_team_name == 1 )
        gb_teamName.show();
      else
        gb_teamName.hide();
      canvas.renderAll();
    }
  });

  $(":input[name='display_room_name']").click(function() {
    fl_show_room_name = $(this)[0].value;

    if (fl_room_name_created) {
      if ( fl_show_room_name == 1 )
        gb_roomName.show();
      else
        gb_roomName.hide();
      canvas.renderAll();
    }
  });

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
              
              while ( rates.length > 0 )
                rates.pop();

              // photo_rate = canvas.width / oImg.width;
              console.log( "Photo rate: " + canvas.width / oImg.width);
              rates.push(canvas.width / oImg.width);
              // oImg.scale( canvas.width / oImg.width );
              oImg.selectable = false;

              canvas.setHeight(canvas.width * oImg.height / oImg.width);

              empty = false;
              photo = oImg;

              canvas.clear();
              canvas.add(oImg);
              // canvas.renderAll();
              resizeCanvas();

              createLogo();
              createTime();
              createTeamName();
              createRoomName();
              createSocialLink();
            });
        };

        reader.readAsDataURL(this.files[0]);
    }
  });

  // Add Image to the Elements or Overlays

  function addPreset(url) {
    var item_template = '\
    <div class="m-list-timeline__item">\
      <span class="m-list-timeline__badge"></span>\
      <span class="m-list-timeline__text">\
        <img src="'+url+'" alt="preset" />\
      </span>\
      <span class="m-list-timeline__time">Just now</span>\
      <span class="m-list-timeline__remove">\
        <a href="#" class="btn btn-sm btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air">\
          <i class="la la-trash"></i>\
        </a>\
      </span>\
    </div>';

    $('#overlay-element .m-list-timeline__items').prepend(item_template);
  }

  // Upload a Preset

  $('#preset-add').click(function() {
    $('#preset-file').click();
  });

  $('#preset-file').change(function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          addPreset(e.target.result);
      };

      reader.readAsDataURL(this.files[0]);
    }
  });

  // Gray an Image

  $('#grayPhoto').click(function() {
    var object = canvas.getActiveObject();
    object.filters.push(new fabric.Image.filters.Grayscale());
    object.applyFilters();
  });

  // $('.m-list-timeline__text').draggable();

  $('.m-list-timeline__text img').click(function() {
    // console.log($(this).attr('src'));
    if ( !empty )
      drawObject($(this).attr('src'));
    else {
      swal("Not allowed", "Please upload your photo first ...", "error");
    }
  });

  $('.m-list-timeline__remove').click(function() {
    var listItem = $(this).parent();

    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: !0,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: !0
    }).then(function(ev) {
        if( ev.value ) {
          swal("Deleted!", "Your file has been deleted.", "success");

          listItem.remove();
          return;
        }
        
        if( "cancel" === ev.dismiss )
          swal("Cancelled", "Your Overlay is safe :)", "error");
    });
  });

})();
