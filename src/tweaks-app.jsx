const PALETTES = [
  ["#0063c5", "#feae00", "#f2f7ff"],
  ["#5a4b8e", "#feae00", "#f5f3fc"],
  ["#0b2433", "#00a1ff", "#f2f7ff"],
  ["#1f3a5a", "#f27200", "#f2f7ff"],
  ["#1a4f44", "#ffd932", "#f2fcf8"],
];

const GROUNDS = {
  warm:  { paper: "#f7f4ec", paper2: "#efeadd", line: "#e6e2d8", line2: "#efece4", ink: "#071526", ink2: "#2a4a68", ink3: "#6b90b0" },
  cool:  { paper: "#f2f7ff", paper2: "#e4eefb", line: "#ccddf2", line2: "#ddeaf8", ink: "#071526", ink2: "#2a4a68", ink3: "#6b90b0" },
  paper: { paper: "#faf7ef", paper2: "#f1ecdd", line: "#e8e2cf", line2: "#efeadb", ink: "#071526", ink2: "#2a4a68", ink3: "#6b90b0" },
};

const DENSITIES = {
  compact: { padBig: 80,  padSmall: 22, gapPillar: 16 },
  regular: { padBig: 120, padSmall: 32, gapPillar: 20 },
  comfy:   { padBig: 160, padSmall: 44, gapPillar: 24 },
};

function mixHex(a, b, t) {
  const ah = a.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16));
  const bh = b.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16));
  return '#' + ah.map((v, i) => Math.round(v * (1 - t) + bh[i] * t).toString(16).padStart(2, '0')).join('');
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const root = document.documentElement;

  React.useEffect(() => {
    const [primary, accent] = t.palette;
    root.style.setProperty('--blue', primary);
    root.style.setProperty('--indigo', primary);
    root.style.setProperty('--gold', accent);
    root.style.setProperty('--orange', accent);
    root.style.setProperty('--blue-3', mixHex(primary, '#000', 0.35));
    root.style.setProperty('--blue-2', mixHex(primary, '#fff', 0.22));
    root.style.setProperty('--indigo-3', mixHex(primary, '#000', 0.35));
    root.style.setProperty('--indigo-2', mixHex(primary, '#fff', 0.22));

    const g = GROUNDS[t.ground] || GROUNDS.warm;
    Object.entries({
      '--paper': g.paper, '--paper-2': g.paper2,
      '--line': g.line, '--line-2': g.line2,
      '--ink': g.ink, '--ink-2': g.ink2, '--ink-3': g.ink3,
    }).forEach(([k, v]) => root.style.setProperty(k, v));

    const d = DENSITIES[t.density] || DENSITIES.regular;
    document.querySelectorAll('section').forEach((s) => {
      if (!s.classList.contains('proof') && !s.classList.contains('sectors')) {
        s.style.paddingTop = `${d.padBig}px`;
        s.style.paddingBottom = `${d.padBig}px`;
      }
    });

    document.querySelector('.proof').style.display = t.showProof ? '' : 'none';
  });

  return (
    <TweaksPanel>
      <TweakSection label="Brand palette" />
      <TweakColor label="Theme" value={t.palette} options={PALETTES} onChange={(v) => setTweak('palette', v)} />
      <TweakSection label="Ground" />
      <TweakRadio label="Tone" value={t.ground} options={['warm', 'cool', 'paper']} onChange={(v) => setTweak('ground', v)} />
      <TweakSection label="Layout" />
      <TweakSelect label="Density" value={t.density} options={['compact', 'regular', 'comfy']} onChange={(v) => setTweak('density', v)} />
      <TweakToggle label="Show logo strip" value={t.showProof} onChange={(v) => setTweak('showProof', v)} />
    </TweaksPanel>
  );
}

function mountTweaksApp() {
  if (typeof TweaksPanel === 'undefined' || typeof useTweaks === 'undefined') {
    setTimeout(mountTweaksApp, 30);
    return;
  }
  const el = document.getElementById('tweaks-root');
  if (!el || el.dataset.mounted) return;
  el.dataset.mounted = '1';
  ReactDOM.createRoot(el).render(<App />);
}

mountTweaksApp();
