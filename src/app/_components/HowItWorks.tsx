export default function HowItWorks() {
  return (
    <dialog id="how-it-works" className="modal ">
      <div className="modal-box w-11/12 max-w-4xl">
        <h3 className="font-bold text-xl">How It Works</h3>
        <p className="mt-8">
          <strong>shiki-loader</strong> is a tiny, copy-and-paste script that helps you to quickly add with a
          syntax-highlighting engine to your web pages without any setup headaches.
        </p>
        <p className="mt-4">
          Behind the scenes, <a href="https://github.com/vespaiach/shiki-loader" className="link">shiki-loader</a> pulls{" "}
          <a href="https://shiki.style/" target="_blank" className="link" rel="noopener">Shiki engine</a> - a powerful syntax highlighter - from{" "}
          <a href="https://esm.sh/shiki@3.0.0" target="_blank" className="link" rel="noopener">esm.sh CDN link</a>, automatically finds all{" "}
          <code>&lt;pre&gt;&lt;code&gt;</code> blocks with classes like
          <code>language-*</code>, and asks Shiki to highlight them.
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" type="submit">
              Close
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}
