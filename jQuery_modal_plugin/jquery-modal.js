export function registerJQueryModalPlugin($) {
  $.fn.showModal = function (inputOptions) {
    const {
      type = 'success',
      content = null,
      onClickAroundModal = true,
      xButtonFn = null,
      okButtonFn = null,
      cancelButtonFn = null,
      modalCss = {
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 999
      },
      onOpenAnimation = {
        display: 'block'
      },
      delayInfoTimer = 0
    } = inputOptions;

    if (!this.length) {
      console.error('Element for modal window was not provided!');
      return this;
    }
    
    const modalContent = $('<div />')
      .css({
        position: 'absolute',
        overflow: 'hidden',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'solid 1px #4D4949',
        borderRadius: '5px',
        width: '600px',
        height: 'auto',
        backgroundColor: '#FFFFFF'
      });
    
    const modalHeader = $('<div />')
      .css({
        width: '600px',
        height: '50px',
        backgroundColor() {
          switch (type) {
            case 'success':
              return '#B7FFB0';
            case 'error':
              return '#FFB0B0';
            case 'info':
            default:
              return '#4BA7F1';
          }
        }
      });
    
    const xButtonEl = $('<button />')
      .text('X')
      .css({
        cursor: 'pointer',
        position: 'absolute',
        height: '40px',
        fontWeight: 'bold',
        fontSize: '20px',
        top: '5px',
        right: '5px',
        borderRadius: '5px',
        padding: '10px 12px',
        border: '1px solid #4D4949',
        color: '#4D4949',
        backgroundColor: 'transparent'
      })
      .hover(
        function(){
          $(this).css({
            backgroundColor: '#393737',
            color: '#FFFFFF'
          });
        },
        function(){
          $(this).css({
            color: '#4D4949',
            backgroundColor: 'transparent'
          });
       }
      )
      .on('click', (event) => {
        if (typeof xButtonFn === 'function') {
          xButtonFn(event);
        }
        this.remove();
      });
      
    const modalText = $('<p />')
      .text(content)
      .css({
        padding: '15px',
        fontSize: '15px'
      });
      
    modalContent.append(modalHeader, xButtonEl, modalText);

    if (cancelButtonFn) {
      const cancelButtonEl = $('<button />')
        .text('Cancel')
        .css({
          cursor: 'pointer',
          height: '45px',
          margin: '15px',
          float: 'right',
          fontSize: '15px',
          borderRadius: '5px',
          padding: '9px 23px',
          border: '1px solid ##4D4C49',
          color: '#FFFFFF',
          backgroundColor: '#4D4C49'
        })
        .hover(function(){
          $(this).css({
            backgroundColor: '#393737'
          });
          }, function(){
          $(this).css({
            backgroundColor: '#4D4C49'
          });
        })
        .on('click', (event) => {
          if (typeof cancelButtonFn === 'function') {
            cancelButtonFn(event);
          }
          this.remove();
        });

      modalContent.append(cancelButtonEl);
    }

    const okButtonEl = $('<button />')
      .text('Ok')
      .css({
        cursor: 'pointer',
        height: '45px',
        margin: '15px',
        float: 'right',
        fontSize: '15px',
        borderRadius: '5px',
        padding: '9px 23px',
        border: '1px solid #4D4949',
        color: '#4D4949',
        backgroundColor: 'transparent'
      })
      .hover(function(){
        $(this).css({
          backgroundColor: '#393737',
          color: '#FFFFFF'
        });
        }, function(){
        $(this).css({
          color: '#4D4949',
          backgroundColor: 'transparent'
        });
      })
      .on('click', (event) => {
        if (typeof okButtonFn === 'function') {
          okButtonFn(event);
        }
        this.remove();
      });
      
    modalContent.append(okButtonEl);
    this.append(modalContent.hide());

    if (type === 'info' && !localStorage.getItem('subscribeOffer')) {
      setTimeout(() => {
        modalContent.show();
        this.css(modalCss).animate(onOpenAnimation);
      }, delayInfoTimer);
    } else if (type !== 'info') {
      modalContent.show();
      this.css(modalCss).animate(onOpenAnimation);
    }
        
    if (onClickAroundModal) {
      this.on('click', function (event) {
        this === event.target ? $(this).remove() : false;
      });
    }
    
    $(document).on('keydown', (event) => {
      event.key === 'Escape' ? $(this).remove() : false;
    });
  };
}
