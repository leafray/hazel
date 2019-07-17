(function($, w, c) {

  "use strict";

$.fn.hazelSlider = function( options ) {

  /* rs Default Settings */
  var defaults = {
    auto   : true,
    background : 'rgba(255, 255, 255, 1)',
    slice  : 7,
    width  : 'auto',
    height : 'auto',
    namespace : 'hazel_slider',
    item : 'hazel-slider-item',
    contentID : 'hazel_slider_content',
    contentEffect : 1,
    pieceNum : 1,
    random : true,
    effects : {},
    delay  : 6000,
    animateTime : 1200,
    imageHeightRatio : 52
  };

  var opts = $.extend( {}, defaults, options );

  return this.each(function() {
    c++;

    var $this = $(this),

        width,
        height,

        namespace = opts.namespace + '_' + c,
        id = '#' + namespace;

        this.id = namespace;

    var _li = $this.find('.' + opts.item),
        active = opts.namespace +'_active',
        _img = opts.namespace + '_img';

        _li.eq(0).addClass(active);

    var firstIndex = _li.first().index(),
        lastIndex = _li.last().index(),
        activeIndex = $('.' + active).index(),
        prevIndex,
        _api = true,

        piece = [],
        _piece,

        _init,
        _events,
        _reset,
        _effectReset,
        _pieceStyle,
        _image,
        _mob,
        _cbtn,
        _btnInit,
        _drag,

        _effects,
        _effect_num,
        effectNum,
        effectTime,

        animateTime = opts.animateTime,
        resizeTimer,
        rand,
        count = 0,
        totalEffects = 5,

        pieceStyle,
        pieceNum = opts.pieceNum,
        totalPieceNum = 1,
        _contentID = '.' + opts.contentID,
        _contents,
        contentConf,
        _contentShow,
        _contentHide,
        totalContentEffect = 2,
        _contentEffect = opts.contentEffect,

        prevBtn,
        nextBtn,

        _index,
        showNext,
        reload,
        intervals = [],
        _hover = false,
        _blur = false;


    /* $this style */
    if(opts.width == 'auto')
      width = $this.parent().outerWidth();
    else
      width = opts.width;

    if(opts.height == 'auto')
      height = ((width * opts.imageHeightRatio) / 100); /* OR $this.parent().outerHeight() */
    else
      height = opts.height;

    $this.css({
      // background : '#f00',
      background : opts.background,
      height : height + 'px',
      width  : width + 'px',
     });


     /* Image Height */
     // _li
     // .find('img')
     // .css({
     //   height : height + 'px',
     // });

    // function addPieceImg(index) {

    //   if( index == lastIndex )
    //     _api = false;

    //   piece = [];

    //   for(var j = 0; j < opts.slice; j++) {
    //     var tp = '<div class="piece piece_' + c + '_' + index + '_' + j + '">' +
    //                 '<div class="piece_img_' + c + '_' + index + '_' + j + '">' +
    //                   '<img src="'+ _li.eq(index).find('img').data('src') +'" class="piece_img" />' +
    //                 '</div>' +
    //              '</div>';
    //     piece.push(tp);
    //   }
      
    //   _piece = piece.join('');

    //   _li.eq(index).find('img').addClass(_img).after( _piece );

    // } 

    for(var i = 0; i <= lastIndex; i++){
      for(var j = 0; j < opts.slice; j++) {
        var tp = '<div class="piece piece_' + c + '_' + i + '_' + j + '">' +
                    '<div class="piece_img_' + c + '_' + i + '_' + j + '">' +
                      '<img src="'+ _li.eq(i).find('img').data('src') +'" class="piece_img" />' +
                    '</div>' +
                 '</div>';
        piece.push(tp);
      }

      _piece = piece.join('');

      /* Add piece */
      _li.eq(i).find('img').addClass(_img).after( _piece );
      // _li.eq(i).html( piece );
      if(i == lastIndex){
        break;
      }
      else
        piece = [];
    }


    /* Effect Number */
    _effect_num = function() {
      var effectLength = opts.effects.length,
      effectRand = Math.ceil(Math.random() * effectLength),
      srand = opts.effects[effectRand - 1];

      if(effectLength > 0 && opts.random == true) {
        if(srand > totalEffects || srand < 1)
          effectNum = Math.ceil(Math.random() * totalEffects);
        else
          effectNum = srand;
      }
      else{
        if(opts.random == true)
          effectNum = Math.ceil(Math.random() * totalEffects);
        else if(effectLength > 0)
            effectNum = srand;
        else
          effectNum = 1;
      }
    }

    /* Piece Style */
    if(opts.pieceNum > totalPieceNum || opts.pieceNum < 1)
     pieceNum = 1;
    else
     pieceNum = opts.pieceNum;

    _pieceStyle = function(i) {
      pieceStyle = {
        ps_1: {
          height : height + 'px',
          // left   : (i * (((width / opts.slice) * 100 ) / width)) + '%',
          left   : (i * (width / opts.slice)) + 'px',
          top    : 0,
          // width  : (((width / opts.slice) * 100 ) / width) + '%'
          width  : (width / opts.slice + 1.3) + 'px',
        },
        // ps_1: {
        //   height : height + 'px',
        //   width  : (width / opts.slice) + 'px',
        // }
      }
      return pieceStyle;
    }

    _reset = function() {
      var p_events = {
        'pointer-events' : 'visible'
      }

      _li
      .find('.' + _img)
      .css({
        opacity : 0,
      });

      _li
      .find('.piece img')
      .css({
        'z-index' : 0
      });

      $this
      .find('button')
      .css({
        'pointer-events' : 'auto'
      });

      $this
      .find('.cbtn')
      .css({
        'pointer-events' : 'auto'
      });

      if(!_mob())
        $this.find('button').prop('disabled', false);
      if(!_mob() && width < 475) {
        $this
        .find('.cbtn a')
        .css(p_events);
      }
      else {
        $this
        .find('.cbtn a')
        .css(p_events);
      }

    }

    _effectReset = function() {
      _li
      .not('.' + active)
      .css({
        display : 'none',
        opacity : 0
      })
      .find('.piece')
      .css({
        height: 0, left: 0, top: 0, width: 0,
      })
      .find('img')
      .css({
        height: 0, left: 0,  opacity: 0, width: 0, transform : 'scale(1)'
      });
    }

    _effects = {

      /* Effect 1 */
      _effect_1 : function(c, i) {
        _image = {
            imageStyle : {
              height : height + 'px',
              opacity : 1,
              top    : 0,
              width  : width + 'px',
            },
            imageAnimate : {
              left    : '-' + (i * (width / opts.slice)) + 'px',
            },
            imageAnimateTime : animateTime
         }
        return _image;
      },

      _effect_1_hide : function() {
        _li
        .eq(prevIndex)
        .find('.piece_img')
        .css({
          transform : 'scale(2)',
          transition : 'transform '+ (animateTime) +'ms',
          'z-index' : 999
        })
        .animate({
          left  : '-' +(width / opts.slice) + 'px',
          // left    : '-' + ((i * (width / opts.slice)) * 3) + 'px',
          opacity : 0,
        }, animateTime);
      },

      // _effect_1_hide : function() {
      //   _li
      //   .eq(prevIndex)
      //   .find('.piece_img')
      //   .css({
      //     transform : 'scale(3)',
      //     transition : 'transform '+ (animateTime * 2.5) +'ms',
      //     'z-index' : 999
      //   })
      //   .animate({
      //     opacity : 0,
      //   }, animateTime / 1.5);
      // },


      /* Effect 2 */
      _effect_2 : function(c, i) {
        _image = {
          imageStyle : {
            height  : (height + 2) + 'px',
            opacity : 1,
            top     : height + 'px',
            left    : '-' + i * (width / opts.slice) + 'px',
            width   : width + 'px'
          },
          imageAnimate : {
            top : 0
          },
          imageAnimateTime :Math.ceil(((animateTime / Math.abs(c) ) + (animateTime / (i + 1))) + (animateTime / opts.slice) * 2)
        }
        return _image;
      },

      _effect_2_hide : function(c, i) {
          var effectTime = Math.ceil(((animateTime / Math.abs(c) ) + (animateTime / (i + 1))) + (animateTime / opts.slice) * 2);

          _li
          .eq(prevIndex)
          .find('.piece_img')
          .eq(i)
          .css({
            height: (height + 2) + 'px'
          })
          .animate({
            top : '-' + height + 'px'
          }, effectTime, function() {

            $(this)
            .css({
              height: height + 'px'
            });

          });
      },

      /* Effect 3 */
      _effect_3 : function(c, i) {
        _image = {
          imageStyle : {
            height  : (height + 2) + 'px',
            opacity : 1,
            top     : '-' + height + 'px',
            left    : '-' + i * (width / opts.slice) + 'px',
            width   : width + 'px'
          },
          imageAnimate : {
            top : 0
          },
          imageAnimateTime : Math.ceil(((animateTime / Math.abs(c) ) + (animateTime / (i + 1))) + (animateTime / opts.slice) * 2)
        }
        return _image;
      },

      _effect_3_hide : function(c, i) {
          var effectTime = Math.ceil(((animateTime / Math.abs(c) ) + (animateTime / (i + 1))) + (animateTime / opts.slice) * 2);

          _li
          .eq(prevIndex)
          .find('.piece_img')
          .eq(i)
          .css({
            height: height + 'px'
          })
          .animate({
            top : height + 'px'
          }, effectTime, function() {

            $(this)
            .css({
              height: height + 'px'
            });

          });
      },

      /* Effect 4 */
      _effect_4 : function(c, i, effectTime) {
        _image = {
          imageStyle : {
            height  : height + 'px',
            opacity : 1,
            top     : height + 'px',
            left    : '-' + i * (width / opts.slice) + 'px',
            width   : width + 'px',
          },
          imageAnimate : {
            top : 0
          },
          imageAnimateTime : effectTime
        }
        return _image;
      },

      _effect_4_hide : function(c, i, effectTime) {
          _li
          .eq(prevIndex)
          .find('.piece_img')
          .eq(i)
          .css({
            height: (height + 2) + 'px'
          })
          .animate({
            top : '-' + height + 'px'
          }, effectTime, function() {

            $(this)
            .css({
              height: height + 'px'
            });

          });
      },

      /* Effect 5 */
      _effect_5 : function(c, i, effectTime) {
        _image = {
          imageStyle : {
            height  : (height + 2) + 'px',
            opacity : 1,
            top     : '-' + height + 'px',
            left    : '-' + i * (width / opts.slice) + 'px',
            width   : width + 'px'
          },
          imageAnimate : {
            top : 0
          },
          imageAnimateTime : effectTime
        }
        return _image;
      },

      _effect_5_hide : function(c, i, effectTime) {
          _li
          .eq(prevIndex)
          .find('.piece_img')
          .eq(i)
          .css({
            height: height + 'px'
          })
          .animate({
            top : height + 'px'
          }, effectTime, function() {

            $(this)
            .css({
              height: height + 'px'
            });

          });
      }
    }

    /* Content Style */
    if(opts.contentEffect > totalContentEffect || opts.contentEffect < 1)
     _contentEffect = 1;
    else
     _contentEffect = opts.contentEffect;

    _contents = {
      _content_1 : function() {

        var cx;
        if( width < ( (_li.eq(activeIndex).find(_contentID).width() / 2) + ( width / 2 ) ) )
          cx = 0;
        else
          cx = (width / 2) - ( _li.eq(activeIndex).find(_contentID).width() / 2 ) + 'px';

        contentConf = {
          contentStyle : {
            left   : cx,
            top    : (height / 2) - ( _li.eq(activeIndex).find(_contentID).height() / 2 ) + 'px',
          },

          contentAnimate : {
            opacity : 1
          },

          contentAnimateTime : animateTime
        }
        return contentConf;
      },

      _content_2 : function() {

        contentConf = {
          contentStyle : {
            height : '100px',
            left   : 0,
            top    : (height - 100) + 'px',
            width  : width + 'px'
          },

          contentAnimate : {
            opacity : 1
          },

          contentAnimateTime : animateTime
        }
        return contentConf;
      }
    };

    _contentShow = function() {
      var content = _contents['_content_' + _contentEffect]();
      _li
      .eq(activeIndex)
      .find(_contentID)
      .css(content.contentStyle)
      .delay(animateTime)
      .animate(content.contentAnimate, content.contentAnimateTime / 2, function() {
        _reset();
      });
    }

    _contentHide = function() {
      _li
      .eq(prevIndex)
      .find(_contentID)
      .animate({
        opacity : 0
      }, animateTime / 2, function() {
        // _reset();

        _li
        .eq(prevIndex)
        .find(_contentID)
        .removeAttr('style');
      });
    }

    _events = function(e, index) {
      _effect_num();

      if(effectNum == 1)
        _effectReset();

      if(e == 1) {
        _index = activeIndex -1;
        prevIndex = _index +1;

        if(_index < firstIndex) {
          _index = lastIndex;
          prevIndex = firstIndex;
        }

      }
      if(e == 2) {
        _index = activeIndex +1;
        prevIndex = _index -1;

        if(_index > lastIndex) {
          _index = firstIndex;
          prevIndex = lastIndex;
        }
      }

      if(e == 3) {
        _index = index;
        if(index < activeIndex)
          prevIndex = activeIndex;
        else
          prevIndex = activeIndex;

        if(_index > lastIndex) {
          _index = firstIndex;
          prevIndex = lastIndex;
        }
      }

      _li.removeClass(active).eq(_index).addClass(active);

      activeIndex = _index;

      if(lastIndex > 0)
        _init();
    }

    _init = function(aTime) {

      // if( _api ) {
      //   addPieceImg(activeIndex);
      // }

      if(typeof aTime == 'undefined')
        aTime = animateTime;

      var effect,
          effectB = false;
      effectTime =  Math.ceil(animateTime / 2) - (animateTime / opts.slice);
      count = piece.length + 1;

      if(effectNum == 1) {
        _effects['_effect_'+ effectNum +'_hide']();
        effectB = true;
      }


      _cbtn();
      _contentHide();
      _contentShow();

      $.each(piece, function(i) {
        count--;
        effectTime += Math.ceil((animateTime / opts.slice) / 1.3);

        effect = _effects['_effect_' + effectNum](count, i, effectTime);

        if(effectNum != 1) {
          _effects['_effect_'+ effectNum +'_hide'](count, i, effectTime);

          _li
          .css({
            opacity : 1
          });
        }

        _li
        .eq(activeIndex)
        .css({
          display : 'block',
          opacity : 1
        })
        .animate({
          // opacity : 1
        }, aTime)
        .find('.piece')
        .eq(i)
        .css(_pieceStyle(i)['ps_' + pieceNum])
        .find('img')
        .css(effect.imageStyle)
        .animate(effect.imageAnimate, effect.imageAnimateTime, function() {
          if(effectB)
            _effectReset();
        });

      });
    }

    _mob = function () {
      if( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
      ){
         return true;
       }
      else {
         return false;
       }
     }

    $this.on('click', 'button', function(e) {
      e.preventDefault();

      var data = $(this).data('btn'),
          _event;
      data == 'prev' ? _event = 1 : _event = 2;

      $this.find('button').prop('disabled', true);

      _events(_event);
    });

    $this.on('click', '.cbtn a', function(e) {
      e.preventDefault();
      intervals.forEach(clearInterval);

      var index = $(this).index(),
          _event = 3;
      if(index == activeIndex) {}
      else {
        $this
        .find('.cbtn a')
        .css({
          'pointer-events' : 'none'
        });

        _events(_event, index);
        var timeout = function() {
          if(opts.auto) {
            reload = setInterval(showNext, opts.delay + opts.animateTime);
            intervals.push(reload);
            _hover = false;
          }
        }
        setTimeout(timeout, opts.delay + opts.animateTime);
      }

    });


    /* Buttons */
    prevBtn = '<button type="button" class="hazel_prev_btn" id="prev-btn" data-btn="prev" role="none"></button>';
    nextBtn = '<button type="button" class="hazel_next_btn" id="next-btn" data-btn="next" role="none"></button>';
    $this.append(prevBtn);
    $this.append(nextBtn);



    _btnInit = function() {
      var btn = $this.find('button'),
          btnStyle;
      btnStyle = {
        'cursor'  : 'pointer',
        opacity : .8,
        top     : ( (height / 2) - btn.height() / 2 ) + 'px'
      };
      btn.css(btnStyle);

      if(!_mob() && width > 475) {
       btn.css({ display : 'block' });
       $this.find('button').prop('disabled', false);
      }
      if(_mob()) {
        btn.css({ display : 'none' });
        $this.find('button').prop('disabled', true);
      }
      if(!_mob() && width < 475) {
        btn.css({ display : 'none' });
        $this.find('button').prop('disabled', true);
      }

    }

    _btnInit();

   /* Mob BTN */
   var ca = '<a href="#"></a>',
       cb = '<div class="cbtn"/>';
       _li.last().after(cb);
   for(var i = 0; i <= lastIndex; i++) {
     $this.find('.cbtn').append(ca);
   }

   _cbtn = function() {
     var mob = _mob();
     if(mob || width < 475) {
       var cbtnStyle = {
         bottom :  '15px',
         left   : (width / 2) - ($this.find('.cbtn').width() / 2) + 'px',
         opacity : 1
       }
       
       $this
       .find('.cbtn')
       .css(cbtnStyle);

       $this
       .find('.cbtn')
       .find('a')
       .html('')
       .eq(activeIndex)
       .append('<span/>');
     }
     else {
       $this
       .find('.cbtn')
       .css({
         opacity : 0
       });
     }
   }


   showNext = function() {
      _events(2);
   }

   if(opts.auto) {
    reload = setInterval(showNext, opts.delay + opts.animateTime);
    intervals.push(reload);
  }

  document.addEventListener('visibilitychange', function() {
    intervals.forEach(clearInterval);

    if (document.visibilityState == 'visible') {
     if(_hover) {
       intervals.forEach(clearInterval);
       _blur = false;
     }
     else {
       if(opts.auto) {
         reload = setInterval(showNext, opts.delay + opts.animateTime);
         intervals.push(reload);
         _blur = false;
       }
     }
    }

    if (document.visibilityState == 'hidden') {
     intervals.forEach(clearInterval);
     _blur = true;
    }
  });


  $this.hover(function() {
    _hover = true;
    intervals.forEach(clearInterval);
  }, function() {
    intervals.forEach(clearInterval);
    _hover = false;
    if(!_blur){
      if(opts.auto) {
        reload = setInterval(showNext, opts.delay + opts.animateTime);
        intervals.push(reload);
      }
    }
  });


  /* Window load */
  // $(window).on('load', function() {
    var aTime = 1;
    effectNum = 1;
    _init(aTime);
  // });

 
  /* When The Window is Resized */
  $(window).on('resize', function(e) {

      $this.height('');

      if(opts.width == 'auto')
        width = $this.parent().outerWidth();
      else
        width = opts.width;

      if(opts.height == 'auto')
        height = ((width * opts.imageHeightRatio) / 100); /* OR $this.parent().outerHeight() */
      else
        height = opts.height;


      animateTime = 1;
      effectNum = 1;

      var content,
          resizeStyle = {
            'height' : height + 'px',
            'width' : width + 'px'
          };

      content = _contents['_content_' + _contentEffect]();

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        animateTime = opts.animateTime;
        effectNum = opts.effects[0];

        _blur = false;
      }, 1000);

      $this
      .css(resizeStyle);

      // _li
      // .css(resizeStyle)
      // .find('.' + _img)
      // .css(resizeStyle);

      _li
      .eq(activeIndex)
      .find(_contentID)
      .css(content.contentStyle);

      _btnInit();
      _init(animateTime);
      
  });


  /* return this each end*/
  });


  /* hazelSlider end */
}


})(jQuery, this, 0);
