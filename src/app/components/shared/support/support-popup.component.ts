import {
  Component, signal, Output, EventEmitter, Input, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-popup.component.html',
  styleUrls: ['./support-popup.component.scss']
})
export class SupportPopupComponent implements OnDestroy {

  /** URL of your Google Business review page — replace with your actual link */
  @Input() googleReviewUrl = 'https://g.page/r/CXLeXliC5RP-EBM/review';

  /**
   * The result container element ID to watch.
   * Pass 'km-results' for Kundali Milan, 'bhav-results' for Bhavishya.
   */
  @Input() resultContainerId = '';

  @Output() closed = new EventEmitter<void>();

  visible     = signal(false);
  selectedAmt = signal<number | null>(null);
  rating      = signal(0);
  hoverStar   = signal(0);

  amounts = [51, 101, 201, 501];

  private scrollListener: (() => void) | null = null;
  private triggered = false;
  private armed     = false;

  /**
   * Called by the parent AFTER result data is set and the DOM has rendered.
   * Only now do we start watching scroll — never before, never on page load.
   */
  arm() {
    this.disarm();                  // remove any old listener first
    this.triggered = false;
    this.armed     = true;
    this.visible.set(false);
    this.selectedAmt.set(null);
    this.rating.set(0);
    this.hoverStar.set(0);

    // Wait one tick so Angular has rendered the result container into the DOM
    setTimeout(() => this.attachScrollListener(), 150);
  }

  private attachScrollListener() {
    if (!this.armed) return;

    this.scrollListener = () => {
      if (this.triggered || !this.resultContainerId) return;

      const container = document.getElementById(this.resultContainerId);
      if (!container) return;

      // getBoundingClientRect().bottom = distance from viewport top to element bottom
      // When this value <= viewportHeight, the bottom of the result section is visible
      const bottomOfResults = container.getBoundingClientRect().bottom;
      const viewportHeight  = window.innerHeight;

      // Fire when the very bottom of the result container enters (or passes) the viewport
      if (bottomOfResults <= viewportHeight + 80) {
        this.triggered = true;
        this.disarm();                              // no more listening needed
        setTimeout(() => this.show(), 700);        // small pause before popup
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private disarm() {
    this.armed = false;
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }
  }

  show() {
    this.visible.set(true);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.visible.set(false);
    document.body.style.overflow = '';
    this.closed.emit();
  }

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('sp-backdrop')) this.close();
  }

  selectAmt(amt: number) {
    this.selectedAmt.set(this.selectedAmt() === amt ? null : amt);
  }

  setRating(s: number) { this.rating.set(s); }

  ratingLabel() {
    const labels = ['', 'Poor 😔', 'Fair 🙂', 'Good 👍', 'Great 🌟', 'Excellent! 🙌'];
    return labels[this.rating()] || '';
  }

  onReviewClick() { /* optionally track */ }

  ngOnDestroy() {
    this.disarm();
    document.body.style.overflow = '';
  }
}
