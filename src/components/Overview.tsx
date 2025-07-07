export default function Overview({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className={`font-mono flex flex-col gap-2 fixed top-0 left-0 sm:w-[400px] sm:right-auto right-0 z-10 bg-white p-4 m-2 rounded-lg transition-opacity duration-300 ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <h1 className="text-lg font-bold">feedbackground</h1>
      <p className="text-xs">
        Feedback in the background. Grab the foreground layer below and move it
        around to see the effect. You can adjust the params to your heart’s
        content on a big screen. See the implementation{' '}
        <a
          href="https://github.com/flatpickles/feedbackground"
          className="underline"
        >
          here
        </a>
        .
      </p>
    </div>
  )
}
