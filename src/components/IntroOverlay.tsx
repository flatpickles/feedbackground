export type IntroOverlayProps = {
  visible: boolean
}

export default function IntroOverlay({ visible }: IntroOverlayProps) {
  return (
    <div
      className={`absolute top-0 left-0 z-10 p-4 transition-opacity duration-500 pointer-events-none w-full sm:w-auto sm:max-w-md ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h1 className="text-2xl font-bold mb-2">Feedbackground</h1>
      <p className="leading-snug">
        Feedback in the background. Grab the foreground layer below and move it
        around to see the effect. Adjust the params to your heart\'s content.
      </p>
    </div>
  )
}
