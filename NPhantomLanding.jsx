import React, { useState, useEffect } from 'react';

const NPhanomLanding = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: '🛡️', title: 'Multi-Domain', desc: 'Effective against radar and thermal detection across all platforms' },
    { icon: '💡', title: 'Indigenous', desc: 'Locally sourced materials with zero import dependency' },
    { icon: '⚡', title: 'Cost Efficient', desc: 'Revolutionary pricing without performance compromise' },
    { icon: '🔧', title: 'Scalable', desc: 'System-oriented design for diverse defence platforms' },
    { icon: '🌍', title: 'Durable', desc: 'Enhanced resistance to environmental degradation' },
    { icon: '✨', title: 'Advanced', desc: 'Layered functional design with optimization' }
  ];

  const specs = [
    { number: '15+', label: 'dB RCS Reduction' },
    { number: '<0.3', label: 'Thermal Emissivity' },
    { number: '>5 MPa', label: 'Adhesion Strength' },
    { number: '500+', label: 'Hours Salt Spray' }
  ];

  const techs = [
    'Oxides Composites', 'Ferrite Integration', 'Resin Matrix', 'Dispersing Agents',
    'Electromagnetic Analysis', 'Thermal Optimization', 'Surface Preparation', 'Layer Integration'
  ];

  return (
    <div style={styles.body}>
      <div style={styles.gridBg}></div>
      <div style={{ ...styles.glowOrb, ...styles.glowOrb1 }}></div>
      <div style={{ ...styles.glowOrb, ...styles.glowOrb2 }}></div>

      <div style={styles.container}>
        {/* Navigation */}
        <nav style={styles.nav}>
          <div style={styles.logo}>N-PHANTOM</div>
          <ul style={styles.navList}>
            <li><a href="#features" style={styles.navLink}>Features</a></li>
            <li><a href="#specs" style={styles.navLink}>Specifications</a></li>
            <li><a href="#tech" style={styles.navLink}>Technology</a></li>
            <li><a href="#contact" style={styles.navLink}>Contact</a></li>
          </ul>
        </nav>

        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Redefining <span style={styles.heroTitleSpan}>Stealth</span>
            </h1>
            <p style={styles.heroSubtitle}>Cost-Efficient Multifunctional Coating System for Defence</p>
            <div style={styles.ctaButtons}>
              <button style={styles.btnPrimary}>EXPLORE NOW</button>
              <button style={styles.btnSecondary}>GET STARTED</button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.features} id="features">
          <h2 style={styles.sectionTitle}>Innovation Highlights</h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <div key={idx} style={styles.featureCard}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specs Section */}
        <section style={styles.specs} id="specs">
          <h2 style={styles.sectionTitle}>Performance Metrics</h2>
          <div style={styles.specsGrid}>
            {specs.map((spec, idx) => (
              <div key={idx} style={styles.specItem}>
                <div style={styles.specNumber}>{spec.number}</div>
                <div style={styles.specLabel}>{spec.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section style={styles.techStack} id="tech">
          <h2 style={styles.sectionTitle}>Core Technology</h2>
          <div style={styles.techItems}>
            {techs.map((tech, idx) => (
              <div key={idx} style={styles.techBadge}>{tech}</div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection} id="contact">
          <h2 style={styles.ctaTitle}>Ready to Transform Defence Technology?</h2>
          <p style={styles.ctaDesc}>Join us in advancing indigenous stealth coating innovation</p>
          <button style={styles.btnPrimary}>START YOUR JOURNEY</button>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>&copy; 2024 N-Phantom-Coating | Cost-Efficient Multifunctional Stealth Coating System</p>
          <p><a href="#" style={styles.footerLink}>GitHub</a> • <a href="#" style={styles.footerLink}>Documentation</a> • <a href="#" style={styles.footerLink}>Contact</a></p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "'Cormorant Garamond', serif",
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1228 100%)',
    color: '#e8e8e8',
    lineHeight: '1.8',
    overflowX: 'hidden',
    minHeight: '100vh'
  },
  gridBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(0deg, rgba(100, 180, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 180, 255, 0.03) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
    zIndex: 0
  },
  glowOrb: {
    position: 'fixed',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.1,
    pointerEvents: 'none',
    zIndex: 1
  },
  glowOrb1: {
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, #64b4ff 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
    animation: 'float 15s ease-in-out infinite'
  },
  glowOrb2: {
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, #ff6b9d 0%, transparent 70%)',
    bottom: '-200px',
    left: '-200px',
    animation: 'float 20s ease-in-out infinite'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 40px',
    position: 'relative',
    zIndex: 2
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 0',
    borderBottom: '1px solid rgba(100, 180, 255, 0.2)',
    marginBottom: '80px'
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '2px',
    background: 'linear-gradient(135deg, #64b4ff, #ff6b9d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  navList: {
    display: 'flex',
    gap: '40px',
    listStyle: 'none',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  navLink: {
    color: '#e8e8e8',
    textDecoration: 'none',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: 'pointer'
  },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    animation: 'fadeInUp 1.2s ease-out'
  },
  heroContent: {
    animation: 'fadeInUp 1.2s ease-out'
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '84px',
    fontWeight: '900',
    marginBottom: '20px',
    lineHeight: '1.1',
    letterSpacing: '-2px'
  },
  heroTitleSpan: {
    background: 'linear-gradient(135deg, #64b4ff, #ff6b9d, #64b4ff)',
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'gradientShift 6s ease infinite'
  },
  heroSubtitle: {
    fontSize: '24px',
    fontWeight: '300',
    color: '#b0b0d0',
    marginBottom: '40px',
    letterSpacing: '1px'
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '50px'
  },
  btn: {
    padding: '16px 48px',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    border: '2px solid',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    fontFamily: "'Space Mono', monospace",
    textDecoration: 'none',
    display: 'inline-block'
  },
  btnPrimary: {
    padding: '16px 48px',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    border: '2px solid #64b4ff',
    borderRadius: '50px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #64b4ff, #4a9ee6)',
    color: '#0a0e27',
    fontFamily: "'Space Mono', monospace",
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  btnSecondary: {
    padding: '16px 48px',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    border: '2px solid #64b4ff',
    borderRadius: '50px',
    cursor: 'pointer',
    background: 'transparent',
    color: '#64b4ff',
    fontFamily: "'Space Mono', monospace",
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  features: {
    padding: '120px 0',
    position: 'relative'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '64px',
    marginBottom: '80px',
    textAlign: 'center',
    position: 'relative'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    marginTop: '60px'
  },
  featureCard: {
    background: 'rgba(20, 25, 50, 0.6)',
    border: '1px solid rgba(100, 180, 255, 0.2)',
    padding: '50px',
    borderRadius: '20px',
    textAlign: 'center',
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: 'pointer'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
    display: 'inline-block'
  },
  featureTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    marginBottom: '15px',
    color: '#64b4ff'
  },
  featureDesc: {
    fontSize: '16px',
    color: '#b0b0d0',
    lineHeight: '1.8'
  },
  specs: {
    padding: '120px 0',
    background: 'rgba(20, 25, 50, 0.3)',
    margin: '80px 0',
    borderTop: '1px solid rgba(100, 180, 255, 0.2)',
    borderBottom: '1px solid rgba(100, 180, 255, 0.2)'
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginTop: '60px'
  },
  specItem: {
    padding: '30px',
    textAlign: 'center',
    borderLeft: '3px solid transparent',
    borderImage: 'linear-gradient(180deg, #64b4ff, #ff6b9d) 1',
    transition: 'all 0.4s ease'
  },
  specNumber: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    background: 'linear-gradient(135deg, #64b4ff, #ff6b9d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px'
  },
  specLabel: {
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#b0b0d0'
  },
  techStack: {
    padding: '120px 0',
    textAlign: 'center'
  },
  techItems: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    marginTop: '60px'
  },
  techBadge: {
    background: 'linear-gradient(135deg, rgba(100, 180, 255, 0.1), rgba(255, 107, 157, 0.1))',
    border: '1px solid rgba(100, 180, 255, 0.3)',
    padding: '30px 20px',
    borderRadius: '15px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.4s ease',
    cursor: 'pointer'
  },
  ctaSection: {
    padding: '100px',
    background: 'linear-gradient(135deg, rgba(100, 180, 255, 0.1), rgba(255, 107, 157, 0.1))',
    borderRadius: '30px',
    textAlign: 'center',
    margin: '80px 0',
    border: '1px solid rgba(100, 180, 255, 0.3)'
  },
  ctaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    marginBottom: '20px'
  },
  ctaDesc: {
    fontSize: '18px',
    color: '#b0b0d0',
    marginBottom: '40px'
  },
  footer: {
    borderTop: '1px solid rgba(100, 180, 255, 0.2)',
    padding: '60px 0',
    textAlign: 'center',
    color: '#808090',
    fontSize: '14px'
  },
  footerLink: {
    color: '#64b4ff',
    textDecoration: 'none',
    cursor: 'pointer'
  }
};

export default NPhanomLanding;
