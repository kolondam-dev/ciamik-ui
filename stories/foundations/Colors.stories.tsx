import type { Meta, StoryObj } from '@storybook/react';

const colorGroups = {
  'Teal (Primary Ramp)': [
    { name: '--ciamik-teal-50', hex: '#E9F2F1' },
    { name: '--ciamik-teal-100', hex: '#A9D0CE' },
    { name: '--ciamik-teal-300', hex: '#5BA3A0' },
    { name: '--ciamik-teal-400', hex: '#2F7A78' },
    { name: '--ciamik-teal-600', hex: '#1F5453' },
    { name: '--ciamik-teal-900', hex: '#123230' },
  ],
  'Coral (Accent Ramp)': [
    { name: '--ciamik-coral-50', hex: '#FFEEE6' },
    { name: '--ciamik-coral-200', hex: '#FFA47A' },
    { name: '--ciamik-coral-400', hex: '#FF7F50' },
    { name: '--ciamik-coral-600', hex: '#C75A30' },
    { name: '--ciamik-coral-800', hex: '#8A3C1D' },
  ],
  'Mustard (Highlight Ramp)': [
    { name: '--ciamik-mustard-50', hex: '#FBF1D8' },
    { name: '--ciamik-mustard-300', hex: '#E0B948' },
    { name: '--ciamik-mustard-400', hex: '#D4A017' },
    { name: '--ciamik-mustard-600', hex: '#9E7710' },
    { name: '--ciamik-mustard-800', hex: '#654C0A' },
  ],
  'Navy (Ink + Dark Surface Ramp)': [
    { name: '--ciamik-navy-50', hex: '#EDEEF3' },
    { name: '--ciamik-navy-200', hex: '#C2C6D6' },
    { name: '--ciamik-navy-400', hex: '#7B82A0' },
    { name: '--ciamik-navy-600', hex: '#3D4870' },
    { name: '--ciamik-navy-800', hex: '#1B264F' },
    { name: '--ciamik-navy-900', hex: '#0E1430' },
  ],
  'Red (Danger)': [
    { name: '--ciamik-red-50', hex: '#FCEBEB' },
    { name: '--ciamik-red-400', hex: '#E24B4A' },
    { name: '--ciamik-red-600', hex: '#C0392B' },
    { name: '--ciamik-red-800', hex: '#791F1F' },
  ],
};

const semanticColors = [
  { label: 'Primary', var: '--ciamik-primary' },
  { label: 'Primary Hover', var: '--ciamik-primary-hover' },
  { label: 'Accent', var: '--ciamik-accent' },
  { label: 'Accent Press', var: '--ciamik-accent-press' },
  { label: 'Highlight', var: '--ciamik-highlight' },
  { label: 'Ink', var: '--ciamik-ink' },
  { label: 'Text Secondary', var: '--ciamik-text-secondary' },
  { label: 'Text Tertiary', var: '--ciamik-text-tertiary' },
  { label: 'Success', var: '--ciamik-success' },
  { label: 'Warning', var: '--ciamik-warning' },
  { label: 'Danger', var: '--ciamik-danger' },
  { label: 'Info', var: '--ciamik-info' },
  { label: 'Surface', var: '--ciamik-surface' },
  { label: 'Background', var: '--ciamik-bg' },
];

const swatchStyle = (color: string): React.CSSProperties => ({
  width: 56,
  height: 56,
  borderRadius: 'var(--r-md)',
  backgroundColor: color,
  border: '1px solid var(--ciamik-border-faint)',
  flexShrink: 0,
});

const ColorsShowcase = () => (
  <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: 'var(--font-family)' }}>
    <h1 style={{ font: 'var(--text-display)', color: 'var(--ciamik-ink)', marginBottom: 8 }}>
      Color Palette
    </h1>
    <p style={{ font: 'var(--text-body)', color: 'var(--ciamik-text-secondary)', marginBottom: 32 }}>
      Ciamik Design System menggunakan arsitektur 3-layer: Primitive → Semantic → Brand.
      Komponen hanya boleh mengonsumsi token Semantic (Layer 2) atau Brand (Layer 3).
    </p>

    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Layer 1 — Primitives
    </h2>
    <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', marginBottom: 24 }}>
      ⚠️ Jangan pakai langsung di komponen. Hanya referensi internal untuk Semantic tokens.
    </p>

    {Object.entries(colorGroups).map(([groupName, colors]) => (
      <div key={groupName} style={{ marginBottom: 32 }}>
        <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', marginBottom: 12 }}>
          {groupName}
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {colors.map((c) => (
            <div key={c.name} style={{ textAlign: 'center' }}>
              <div style={swatchStyle(c.hex)} />
              <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)', marginTop: 6 }}>
                {c.name.replace('--ciamik-', '')}
              </div>
              <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', fontSize: 10 }}>
                {c.hex}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}

    <hr style={{ border: 'none', borderTop: '1px solid var(--ciamik-border-faint)', margin: '32px 0' }} />

    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Layer 2 — Semantic Roles
    </h2>
    <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', marginBottom: 24 }}>
      ✅ Gunakan token ini di komponen. Dapat di-override oleh Brand token (Layer 3).
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
      {semanticColors.map((c) => (
        <div key={c.var} style={{ textAlign: 'center' }}>
          <div style={{ ...swatchStyle(`var(${c.var})`), width: '100%', height: 64 }} />
          <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-ink)', marginTop: 8, fontWeight: 600 }}>
            {c.label}
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', fontSize: 10 }}>
            {c.var}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const Palette: Story = {
  render: () => <ColorsShowcase />,
};
