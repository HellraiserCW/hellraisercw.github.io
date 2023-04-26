function Slider(container, buttons, interval) {
  if (!(container instanceof Element)) {
    throw new Error('No slider passed in');
  }

  this.index = 0;
  this.infiniteTimerId = null;
  this.hoverStatus = false;
  this.shiftSide = 'right';
  this.container = container;
  this.leftButton = buttons.querySelector('.button--left');
  this.rightButton = buttons.querySelector('.button--right');
  this.slideLength = this.container.firstElementChild.offsetWidth;
  this.gap = parseInt(window.getComputedStyle(this.container).columnGap) || 0;
  this.slides = this.container.childNodes;
  this.elementsVisible = Math.floor(this.container.offsetWidth / this.slideLength);
  this.sliderWidth = (this.slideLength + this.gap) * this.elementsVisible;
  this.interval = interval;

  this.init = () => {
    this.createCloneSlides();
    setTimeout(() => this.shiftSlidesRight(), this.interval);

    this.leftButton.addEventListener('click', this.shiftSlidesLeft);
    this.rightButton.addEventListener('click', this.shiftSlidesRight);

    this.container.addEventListener('mouseover', () => {
      clearTimeout(this.infiniteTimerId);
      this.hoverStatus = true;
    });

    this.container.addEventListener('mouseout', () => {
      this.hoverStatus = false;
      this.shiftSide === 'right'
        ? this.infiniteTimerId = setTimeout(() => this.shiftSlidesRight(), this.interval)
        : this.infiniteTimerId = setTimeout(() => this.shiftSlidesLeft(), this.interval);
    });
  };

  this.createCloneSlides = () => {
    while (this.elementsVisible - this.slides.length > 0) {
      this.container.append(this.slides[0].cloneNode(true));
    }

    for (let i = 0; i < this.elementsVisible; i++) {
      const cloneBeforeStart = this.slides[2 * i].cloneNode(true);
      const cloneAfterEnd = this.slides[this.slides.length - 1 - 2 * i].cloneNode(true);
      this.container.append(cloneBeforeStart);
      this.container.insertBefore(cloneAfterEnd, this.slides[0]);
    }
    this.container.style.left = -this.sliderWidth + 'px';
  };

  this.shiftSlidesRight = () => {
    clearTimeout(this.infiniteTimerId);
    this.leftButton.removeEventListener('click', this.shiftSlidesLeft);
    this.rightButton.removeEventListener('click', this.shiftSlidesRight);
    this.container.style.transition = 'all 1s';

    if (!this.slideNumber) {
      this.container.style.left = (parseInt(this.container.style.left) || 0) - this.sliderWidth + 'px';
      this.index += this.elementsVisible;
    } else {
      this.container.style.left = -this.sliderWidth * this.slideNumber + 'px';
      this.index = this.slideNumber - 1;
      this.slideNumber = null;
    }

    this.container.addEventListener('transitionend', this.checkIndexRight, { once: true });
    this.shiftSide = 'right';
  };

  this.shiftSlidesLeft = () => {
    clearTimeout(this.infiniteTimerId);
    this.leftButton.removeEventListener('click', this.shiftSlidesLeft);
    this.rightButton.removeEventListener('click', this.shiftSlidesRight);
    this.container.style.transition = 'all 1s';

    if (!this.slideNumber) {
      this.container.style.left = (parseInt(this.container.style.left) || 0) + this.sliderWidth + 'px';
      this.index -= this.elementsVisible;
    } else {
      this.container.style.left = -this.sliderWidth * this.slideNumber + 'px';
      this.index = this.slideNumber - 1;
      this.slideNumber = null;
    }

    this.container.addEventListener('transitionend', this.checkIndexLeft, { once: true });
    this.shiftSide = 'left';
  };

  this.checkIndexRight = () => {
    [...this.container.childNodes].forEach(node => {
      node.style.transition = '';
    });
    this.container.style.transition = '';
    this.indexToCheck = this.slides.length - 2 * this.elementsVisible;

    if (this.index >= this.indexToCheck) {
      this.correctSliderPositionRight(0);
    } else if (this.elementsVisible > 1 && this.index === this.indexToCheck - 1) {
      this.correctSliderPositionRight(1);
    } else if (this.elementsVisible > 2 && this.index === this.indexToCheck - 2) {
      this.correctSliderPositionRight(2);
    }

    this.onRightMoved();
  };

  this.checkIndexLeft = () => {
    [...this.container.childNodes].forEach(node => {
      node.style.transition = '';
    });
    this.container.style.transition = '';
    this.indexToCheck = -1;

    if (this.index === this.indexToCheck) {
      this.correctSliderPositionLeft(1);
    } else if (this.index === this.indexToCheck - 1) {
      this.correctSliderPositionLeft(2);
    } else if (this.index <= this.indexToCheck - 2) {
      this.correctSliderPositionLeft(3);
    }

    this.onLeftMoved();
  };

  this.correctSliderPositionRight = (shift) => {
    this.index = -shift;
    this.container.style.left = -this.sliderWidth - this.index * (this.slideLength + this.gap) + 'px';
  };

  this.correctSliderPositionLeft = (shift) => {
    this.index = this.slides.length - shift - this.elementsVisible * 2;
    this.container.style.left = -this.sliderWidth - this.index * (this.slideLength + this.gap) + 'px';
  };

  this.onRightMoved = () => {
    clearTimeout(this.infiniteTimerId);
    this.leftButton.addEventListener('click', this.shiftSlidesLeft);
    this.rightButton.addEventListener('click', this.shiftSlidesRight);

    if (!this.hoverStatus) {
      this.infiniteTimerId = setTimeout(() => {
        this.shiftSlidesRight();
      }, this.interval);
    }
  };

  this.onLeftMoved = () => {
    clearTimeout(this.infiniteTimerId);
    this.leftButton.addEventListener('click', this.shiftSlidesLeft);
    this.rightButton.addEventListener('click', this.shiftSlidesRight);

    if (!this.hoverStatus) {
      this.infiniteTimerId = setTimeout(() => {
        this.shiftSlidesLeft();
      }, this.interval);
    }
  };
}

export function PortfolioSlider(container, buttons, interval) {
  Slider.call(this, container, buttons, interval);

  this.initSuper = this.init;
  this.shiftSlidesRightSuper = this.shiftSlidesRight;
  this.shiftSlidesLeftSuper = this.shiftSlidesLeft;
  this.correctSliderPositionRightSuper = this.correctSliderPositionRight;
  this.correctSliderPositionLeftSuper = this.correctSliderPositionLeft;

  this.init = () => {
    this.initSuper();
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.scale = '1.2';
    this.onHoverTextStyleFeature();
  };

  this.onHoverTextStyleFeature = () => {
    this.container.addEventListener('mouseover', () => {
      const slideHeader = event.target.querySelector('.portfolio__slide-header');
      const slideText = event.target.querySelector('.portfolio__slide-text');
      slideHeader.style.fontSize = '36px';
      slideHeader.style.lineHeight = '48px';
      slideHeader.style.textShadow = 'black 0px 0px 5px';
      slideText.style.fontSize = '28px';
      slideText.style.lineHeight = '36px';
      slideText.style.textShadow = 'black 0px 0px 5px';
    });

    this.container.addEventListener('mouseout', () => {
      const slideHeader = event.target.querySelector('.portfolio__slide-header');
      const slideText = event.target.querySelector('.portfolio__slide-text');
      slideHeader.style.fontSize = '20px';
      slideHeader.style.lineHeight = '32px';
      slideHeader.style.textShadow = '';
      slideText.style.fontSize = '15px';
      slideText.style.lineHeight = '25px';
      slideText.style.textShadow = '';
    });
  };

  this.shiftSlidesRight = () => {
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.scale = '';
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.transition = 'all 1s';
    this.container.childNodes[this.index + 1 + 2 * this.elementsVisible].style.scale = '1.2';
    this.container.childNodes[this.index + 1 + 2 * this.elementsVisible].style.transition = 'all 1s';
    
    this.shiftSlidesRightSuper();
  };

  this.shiftSlidesLeft = () => {
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.scale = '';
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.transition = 'all 1s';
    this.container.childNodes[this.index + 1].style.scale = '1.2';
    this.container.childNodes[this.index + 1].style.transition = 'all 1s';
    
    this.shiftSlidesLeftSuper();
  };

  this.correctSliderPositionRight = (shift) => {
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.scale = '';
    
    this.correctSliderPositionRightSuper(shift);

    this.container.childNodes[this.index + 1 + this.elementsVisible].style.transition = '';
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.scale = '1.2';
  };

  this.correctSliderPositionLeft = (shift) => {
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.scale = '';

    this.correctSliderPositionLeftSuper(shift);
    
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.transition = '';
    this.container.childNodes[this.index + 1 + this.elementsVisible].style.scale = '1.2';
  };
}

export function TestimonialsSlider(container, buttons, interval) {
  Slider.call(this, container, buttons, interval);

  this.initSuper = this.init;
  this.pointerCoords = null;
  this.pxToRunShift = 20;
  this.slideNumber = null;
  this.dots = document.createElement('div');
  this.shiftSlidesRightSuper = this.shiftSlidesRight;
  this.shiftSlidesLeftSuper = this.shiftSlidesLeft;
  this.currentDot = null;

  this.init = () => {
    this.initSuper();
    this.grabSlideFeature();
    this.selectWithDotsFeature();
  };

  this.grabSlideFeature = () => {
    this.container.addEventListener('mousedown', this.calculateStartCoords, { once: true });
  };
  
  this.calculateStartCoords = () => {
    this.container.addEventListener('mouseup', this.calculateEndCoords, { once: true });
    this.pointerCoords = event.screenX;
  };
  
  this.calculateEndCoords = () => {
    this.pointerCoords -= event.screenX;

    if (this.pointerCoords > this.pxToRunShift) {
      if (this.index >= this.slides.length - 2) {
        this.index = 0;
        this.container.style.left = -this.sliderWidth - this.index * (this.slideLength + this.gap) + 'px';
      }

      this.shiftSlidesRight();

      this.container.addEventListener('transitionend', () => {
        this.container.addEventListener('mousedown', this.calculateStartCoords, { once: true });
      }, { once: true });
    } else if (this.pointerCoords < -this.pxToRunShift) {
      if (this.index < 0) {
        this.index = this.slides.length - 2;
        this.container.style.left = -this.sliderWidth - this.index * (this.slideLength + this.gap) + 'px';
      }

      this.shiftSlidesLeft();

      this.container.addEventListener('transitionend', () => {
        this.container.addEventListener('mousedown', this.calculateStartCoords, { once: true });
      }, { once: true });
    } else {
      this.container.addEventListener('mousedown', this.calculateStartCoords, { once: true });
    }
  }

  this.selectWithDotsFeature = () => {
    this.dots.style.cssText = `
      position: absolute;
      display: flex;
      justify-content: center;
      width: 100%;
    `;

    for (let i = this.elementsVisible; i < this.slides.length - this.elementsVisible; ++i) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 10px;
        height: 10px;
        background-color: gray;
        border-radius: 50%;
        margin: 0 5px;
        cursor: pointer;
      `;
      dot.classList.add(`${i}`);
      this.dots.appendChild(dot);
      dot.addEventListener('click', this.dotClick);
    }

    this.container.parentElement.parentElement.append(this.dots);
    this.currentDot = this.container.parentElement.parentElement.querySelector(`[class='1']`);
    this.currentDot.style.backgroundColor = '#393737';
  };

  this.dotClick = () => {
    this.slideNumber = +event.target.classList.value;
    if (this.index === this.slideNumber - 1) {
      this.slideNumber = null;
    } else if (this.shiftSide === 'right') {
      this.shiftSlidesRight();
    } else {
      this.shiftSlidesLeft();
    }
  };

  this.shiftSlidesRight = () => {
    this.currentDot.style.backgroundColor = 'gray';

    this.shiftSlidesRightSuper();

    this.currentDot = this.index >= this.slides.length - 2 * this.elementsVisible
      ? this.container.parentElement.parentElement.querySelector(`[class='1']`)
      : this.container.parentElement.parentElement.querySelector(`[class='${this.index + 1}']`)
    this.currentDot.style.backgroundColor = '#393737';
  };

  this.shiftSlidesLeft = () => {
    this.currentDot.style.backgroundColor = 'gray';

    this.shiftSlidesLeftSuper();

    this.currentDot = this.index < 0
      ? this.container.parentElement.parentElement.querySelector(
        `[class='${this.slides.length - 2 * this.elementsVisible}']`
      )
      : this.container.parentElement.parentElement.querySelector(`[class='${this.index + 1}']`)
    this.currentDot.style.backgroundColor = '#393737';
  };
}
