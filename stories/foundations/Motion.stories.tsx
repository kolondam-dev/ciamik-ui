import type { Meta, StoryObj } from '@storybook/react';

const durations = [
  { name: 'Fast', token: '--dur-fast', value: '120ms', use: 'Hover state, color transition' },
  { name: 'Base', token: '--dur-base', value: '200ms', use: 'Standard interaction feedback' },
  { name: 'Slow', token: '--dur-slow', value: '340ms', use: 'Complex element transitions' },
];

const easings = [
  { name: 'Default', token: '--ease', value: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
  { name: 'Ease Out', token: '--ease-out', value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { name: 'Ease In', token: '--ease-in', value: 'cubic-bezier(0.55, 0, 1, 0.45)' },
];

const animations = [
  { name: 'Shimmer', keyframe: 'ciamik-shimmer', description: 'Loading skeleton shimmer effect' },
  { name: 'Spin', keyframe: 'ciamik-spin', description: 'Continuous rotation for spinners' },
  { name: 'Fade In', keyframe: 'ciamik-fade-in', description: 'Fade in with slight upward slide' },
  { name: 'Scale In', keyframe: 'ciamik-scale-in', description: 'Fade in with scale-up' },
  { name: 'Pulse', keyframe: 'ciamik-pulse', description: 'Subtle opacity pulse for skeleton' },
];

const MotionShowcase = () => (
  <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: 'var(--font-family)' }}>
    <h1 style={{ font: 'var(--text-display)', color: 'var(--ciamik-ink)', marginBottom: 8 }}>
      Motion & Animation
    </h1>
    <p style={{ font: 'var(--text-body)', color: 'var(--ciamik-text-secondary)', marginBottom: 32 }}>
      Prinsip: Meaningful, cepat, fungsional — bukan dekoratif. Respects{' '}
      <code>prefers-reduced-motion</code>.
    </p>

    {/* Duration Tokens */}
    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Duration Tokens
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
      {durations.map((d) => (
        <div key={d.name} style={{
          display: 'grid', gridTemplateColumns: '80px 120px 80px 1fr',
          alignItems: 'center', gap: 16, padding: '12px 0',
          borderBottom: '1px solid var(--ciamik-border-faint)',
        }}>
          <span style={{ font: 'var(--text-small)', fontWeight: 600, color: 'var(--ciamik-ink)' }}>
            {d.name}
          </span>
          <code style={{ font: 'var(--text-caption)', fontFamily: 'var(--font-mono)', color: 'var(--ciamik-text-secondary)' }}>
            {d.token}
          </code>
          <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-primary)', fontWeight: 700 }}>
            {d.value}
          </span>
          <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)' }}>
            {d.use}
          </span>
        </div>
      ))}
    </div>

    {/* Easing Tokens */}
    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Easing Functions
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
      {easings.map((e) => (
        <div key={e.name} style={{
          display: 'grid', gridTemplateColumns: '100px 1fr',
          alignItems: 'center', gap: 16, padding: '12px 0',
          borderBottom: '1px solid var(--ciamik-border-faint)',
        }}>
          <span style={{ font: 'var(--text-small)', fontWeight: 600, color: 'var(--ciamik-ink)' }}>
            {e.name}
          </span>
          <code style={{ font: 'var(--text-caption)', fontFamily: 'var(--font-mono)', color: 'var(--ciamik-text-secondary)', fontSize: 11 }}>
            {e.value}
          </code>
        </div>
      ))}
    </div>

    {/* Live Animation Demos */}
    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Keyframe Animations
    </h2>
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {animations.map((a) => (
        <div key={a.name} style={{
          width: 140, padding: 16, textAlign: 'center',
          backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--ciamik-border-faint)',
        }}>
          <div style={{
            width: 48, height: 48,
            margin: '0 auto 12px',
            backgroundColor: a.keyframe === 'ciamik-shimmer'
              ? 'var(--ciamik-skeleton-bg)'
              : 'var(--ciamik-primary)',
            borderRadius: a.keyframe === 'ciamik-spin' ? '50%' : 'var(--r-md)',
            animation: `${a.keyframe} ${a.keyframe === 'ciamik-spin' ? '1s linear infinite' : a.keyframe === 'ciamik-pulse' ? '2s ease-in-out infinite' : a.keyframe === 'ciamik-shimmer' ? '1.5s infinite' : '0.6s var(--ease) forwards'}`,
            ...(a.keyframe === 'ciamik-shimmer' ? {
              background: `linear-gradient(90deg, var(--ciamik-skeleton-bg) 0%, var(--ciamik-skeleton-shimmer) 50%, var(--ciamik-skeleton-bg) 100%)`,
              backgroundSize: '200% 100%',
            } : {}),
            ...(a.keyframe === 'ciamik-spin' ? {
              borderTop: '3px solid var(--ciamik-primary)',
              borderRight: '3px solid transparent',
              borderBottom: '3px solid transparent',
              borderLeft: '3px solid transparent',
              backgroundColor: 'transparent',
            } : {}),
          }} />
          <div style={{ font: 'var(--text-caption)', fontWeight: 700, color: 'var(--ciamik-ink)' }}>
            {a.name}
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', fontSize: 10, marginTop: 4 }}>
            {a.description}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Motion',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <MotionShowcase />,
};
