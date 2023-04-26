1.  Copy plugin folder to your project folder

2.  On each html page to call modal window add following line to plug Jquery engine inside <head> tag:
<script src="..path_to_folder../lib/jquery-3.6.3.min.js"></script>
and add following line to plug modal itself before closing </body> tag:
<script src="..path_to_folder../jquery-modal.js" type="module"></script>

3.  Add script to each of your page as follows:
//import function from modal file
import { registerJQueryModalPlugin } from '..path_to_folder../jquery-modal.js';
//initialize it
registerJQueryModalPlugin($);

4. Be sure to insert this modal window call after your DOM tree is ready:
//append emty div where modal will appear
$('body').append($('<div />').addClass('modal'));
//call modal with passing parameters
$('.modal').showModal({});

5.  Each window is configurable, .showModal() method accepts an object with next default options:
      type = 'success' //type of window: 'success', 'error' or 'info' ONLY!
      content = null //input a string of content text
      onClickAroundModal = true //close modal window with no additional action by clicking outside it: true or false
      xButtonFn = null //function, additional to defaults close modal window action
      okButtonFn = null //function, additional to defaults close modal window action
      cancelButtonFn = null //function, additional to defaults close modal window action
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
      } //object accepting any CSS rules to add custom styles to modal window before appearing animation
      onOpenAnimation = {
        display: 'block'
      } //object accepting any CSS rules to add custom animation styles to modal window
      delayInfoTimer = 0 // number in ms before modal window is shown on page

6.  Ready code for 3 different 'info' type windows with different animations and 'error' type window code to prompt post deletion according to requirements EPAM RD Phase 12 homework #16 are below:

//1-st 'info' window:

$('body').prepend($('<div />').addClass('modal-info'));

$('.modal-info').showModal({
  type: 'info',
  content: 'Subscribe to this blog and be first to know about updates',
  okButtonFn: () => {
    localStorage.setItem('subscribeOffer', true);
  },
  modalCss: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    width: '0',
    height: '0',
    background: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999
  },
  onOpenAnimation: {
    width: '100%',
    height: '100%',
    transition: '0.2s'
  },
  delayInfoTimer: 10000
});

//2-nd 'info' window:

$('body').prepend($('<div />').addClass('modal-info'));

$('.modal-info').showModal({
  type: 'info',
  content: 'Subscribe to this blog and be first to know about updates',
  okButtonFn: () => {
    localStorage.setItem('subscribeOffer', true);
  },
  modalCss: {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    width: '100%',
    height: '100%',
    opacity: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999
  },
  onOpenAnimation: {
    opacity: 1,
    transition: '0.2s'
  },
  delayInfoTimer: 10000
});

//3-rd 'info' window:

$('body').prepend($('<div />').addClass('modal-info'));

$('.modal-info').showModal({
  type: 'info',
  content: 'Subscribe to this blog and be first to know about updates',
  okButtonFn: () => {
    localStorage.setItem('subscribeOffer', true);
  },
  modalCss: {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    width: '100%',
    height: '0',
    background: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999
  },
  onOpenAnimation: {
    height: '100%',
    transition: '0.2s'
  },
  delayInfoTimer: 10000
});

//'error' window prompting post deletion:

const postItem = '.post-item';// to work correct pass here your post css class
const deletePostButton = '.post-item__text-delete-post';// to work correct pass here your Delete post button css class

$(deletePostButton).on('click', (event) => {
  $('body').prepend($('<div />').addClass('modal-error'));
  
  $('.modal-error').showModal({
    type: 'error',
    content: 'Are you sure you want to delete this post?',
    onClickAroundModal: false,
    okButtonFn: () => {
      $(event.target).closest(postItem).remove();
    },
    cancelButtonFn: () => {
      return;
    }
  })
});
