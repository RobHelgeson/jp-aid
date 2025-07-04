import {animate, AnimationTriggerMetadata, query, style, transition, trigger} from '@angular/animations';

const ANIMATION_DURATION = '400ms';
const ANIMATION_EASING = 'cubic-bezier(0.4, 0.0, 0.2, 1)';

// Helper function to check if user prefers reduced motion
const shouldReduceMotion = (): boolean => {
  // Handle test environment where window.matchMedia is not available
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Slide up and out of viewport (for search page exit)
export const slideUpOut: AnimationTriggerMetadata = trigger('slideUpOut', [
  transition(':leave', [
    animate(
      shouldReduceMotion() ? '0ms' : `${ANIMATION_DURATION} ${ANIMATION_EASING}`,
      style({
        transform: 'translateY(-100%)',
        opacity: 0
      })
    )
  ])
]);

// Slide up from bottom into viewport (for results page entry)
export const slideUpIn: AnimationTriggerMetadata = trigger('slideUpIn', [
  transition(':enter', [
    style({
      transform: 'translateY(100%)',
      opacity: 0
    }),
    animate(
      shouldReduceMotion() ? '0ms' : `${ANIMATION_DURATION} ${ANIMATION_EASING}`,
      style({
        transform: 'translateY(0)',
        opacity: 1
      })
    )
  ])
]);

// Spinner animations (up from bottom, then up out of top)
export const spinnerSlideUp: AnimationTriggerMetadata = trigger('spinnerSlideUp', [
  transition(':enter', [
    style({
      transform: 'translateY(100%)',
      opacity: 0
    }),
    animate(
      shouldReduceMotion() ? '0ms' : '300ms ease-out',
      style({
        transform: 'translateY(0)',
        opacity: 1
      })
    )
  ]),
  transition(':leave', [
    animate(
      shouldReduceMotion() ? '0ms' : '300ms ease-in',
      style({
        transform: 'translateY(-100%)',
        opacity: 0
      })
    )
  ])
]);

// Route animations for router outlet
export const routeAnimations: AnimationTriggerMetadata = trigger('routeAnimations', [
  transition('SearchPage => ResultsPage', [
    style({position: 'relative'}),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        })
      ],
      {optional: true}
    ),
    query(
      ':leave',
      [
        animate(
          shouldReduceMotion() ? '0ms' : `${ANIMATION_DURATION} ${ANIMATION_EASING}`,
          style({transform: 'translateY(-100%)', opacity: 0})
        )
      ],
      {optional: true}
    ),
    query(
      ':enter',
      [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate(shouldReduceMotion() ? '0ms' : `${ANIMATION_DURATION} ${ANIMATION_EASING}`, style({transform: 'translateY(0)', opacity: 1}))
      ],
      {optional: true}
    )
  ])
]);

// Export all animations
export const pageTransitionAnimations = [slideUpOut, slideUpIn, spinnerSlideUp, routeAnimations];
