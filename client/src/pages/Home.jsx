import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Home.css';

const Home = () => {
  const [poolVisible, setPoolVisible] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const poolRef = useRef(null);

  const testimonials = [
    { quote: "I joined for the golf, stayed for the community. Winning ₹4,200 last month while supporting St Jude's was genuinely life-changing.", name: 'Marcus Chen', since: '2024' },
    { quote: "This isn't your typical golf platform. It feels alive, modern, and the fact that my subscription directly helps charities makes every round more meaningful.", name: 'Sarah Mitchell', since: '2023' },
    { quote: "The monthly draws add an incredible layer of excitement. Even when I don't win, knowing my scores contribute to charity keeps me coming back.", name: 'James O\'Brien', since: '2024' },
    { quote: "As someone who plays golf weekly, having a platform that tracks my scores AND gives back to the community is exactly what was missing.", name: 'Priya Patel', since: '2025' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPoolVisible(true);
    }, { threshold: 0.3 });
    if (poolRef.current) observer.observe(poolRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const calcCountdown = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = endOfMonth - now;
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    calcCountdown();
    const timer = setInterval(calcCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__noise" />
        <div className="hero__glow" />
        <div className="hero__content container--wide">
          <div className="hero__left">
            <div className="hero__tag">
              <span className="hero__tag-line" />
              <span className="hero__tag-text">MONTHLY DRAWS · CHARITY GIVING</span>
            </div>
            <h1 className="hero__title">
              <span className="hero__title-line font-display">Golf That</span>
              <span className="hero__title-line hero__title-outline font-display">GIVES BACK</span>
              <span className="hero__title-sub">Every Single Month.</span>
            </h1>
            <p className="hero__body">Subscribe, enter your golf scores, and compete in monthly prize draws — all while contributing to meaningful charitable causes.</p>
            <div className="hero__ctas">
              <Link to="/subscribe" className="hero__cta-primary">Subscribe Now <ArrowRight size={16} /></Link>
              <Link to="/charities" className="hero__cta-secondary">Explore Charities</Link>
            </div>
          </div>
          <div className="hero__right">
            <span className="hero__watermark font-display">₹185K</span>
            <div className="hero__stat-main">
              <span className="hero__stat-value font-display">₹185,000</span>
              <div className="hero__stat-divider" />
              <span className="hero__stat-label">IN PRIZES AWARDED</span>
            </div>
            <div className="hero__stat-secondary">
              <span className="hero__stat-members font-display">2,400+</span>
              <span className="hero__stat-members-label">Members</span>
            </div>
          </div>
        </div>
        <div className="hero__ticker">
          <div className="hero__ticker-track">
            <span>2,400 MEMBERS &nbsp;——&nbsp; ₹185K PRIZES AWARDED &nbsp;——&nbsp; ₹52K TO CHARITY &nbsp;——&nbsp; MONTHLY DRAWS &nbsp;——&nbsp; JOIN TODAY &nbsp;——&nbsp; 2,400 MEMBERS &nbsp;——&nbsp; ₹185K PRIZES AWARDED &nbsp;——&nbsp; ₹52K TO CHARITY &nbsp;——&nbsp; MONTHLY DRAWS &nbsp;——&nbsp; JOIN TODAY &nbsp;——&nbsp;</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container--wide">
          <div className="how-it-works__label">
            <span className="how-it-works__label-bar" />
            <span className="how-it-works__label-text">HOW IT WORKS</span>
          </div>

          <div className="how-step">
            <div className="how-step__text">
              <span className="how-step__number font-display">01</span>
              <h3 className="how-step__title font-display">Subscribe & Choose Your Cause</h3>
              <p className="how-step__desc">Pick a monthly or yearly plan, select a charity close to your heart, and set your contribution percentage. A minimum of 10% of your subscription goes directly to your chosen cause.</p>
            </div>
            <div className="how-step__visual">
              <div className="how-step__mock-score">
                <div className="mock-input"><span className="mock-label">SCORE</span><span className="mock-value">38</span></div>
                <div className="mock-input"><span className="mock-label">DATE</span><span className="mock-value">15 Mar 2026</span></div>
                <div className="mock-btn">Submit Score</div>
              </div>
            </div>
          </div>

          <div className="how-step how-step--reverse">
            <div className="how-step__text">
              <span className="how-step__number font-display">02</span>
              <h3 className="how-step__title font-display">Enter Your Stableford Scores</h3>
              <p className="how-step__desc">Log up to 5 of your best Stableford scores. Your scores are matched against monthly draw numbers — the more matches, the bigger your prize.</p>
            </div>
            <div className="how-step__visual">
              <div className="how-step__mock-draw">
                {[12, 27, 33, 38, 41].map((n, i) => (
                  <div key={i} className={`mock-ball ${i === 3 ? 'mock-ball--match' : ''}`}>{n}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="how-step">
            <div className="how-step__text">
              <span className="how-step__number font-display">03</span>
              <h3 className="how-step__title font-display">Win Prizes, Change Lives</h3>
              <p className="how-step__desc">Match 3, 4, or 5 numbers to win from the prize pool. Jackpots roll over when unclaimed. Meanwhile, your contribution makes a real impact on the charities that matter most.</p>
            </div>
            <div className="how-step__visual">
              <div className="how-step__mock-impact">
                <div className="mock-impact-stat">
                  <span className="mock-impact-value font-display">₹52K</span>
                  <span className="mock-impact-label">to charity</span>
                </div>
                <div className="mock-impact-stat">
                  <span className="mock-impact-value font-display">18</span>
                  <span className="mock-impact-label">charities supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Pool */}
      <section className="prize-pool" ref={poolRef}>
        <div className="prize-pool__texture" />
        <div className="prize-pool__inner container--wide">
          <div className="prize-pool__left">
            <span className="prize-pool__label">THIS MONTH'S JACKPOT</span>
            <div className={`prize-pool__amount font-display ${poolVisible ? 'prize-pool__amount--visible' : ''}`}>₹31,000</div>
            <div className="prize-pool__divider" />
            <div className="prize-pool__breakdown">
              <div className="prize-row"><span>5 Number Match</span><span className="prize-row__value">₹12,400</span></div>
              <div className="prize-row"><span>4 Number Match</span><span className="prize-row__value">₹10,850</span></div>
              <div className="prize-row"><span>3 Number Match</span><span className="prize-row__value">₹7,750</span></div>
            </div>
          </div>
          <div className="prize-pool__right">
            <div className="countdown">
              <div className="countdown__item">
                <span className="countdown__number font-display">{String(countdown.days).padStart(2, '0')}</span>
                <span className="countdown__label">DAYS</span>
              </div>
              <span className="countdown__sep font-display">:</span>
              <div className="countdown__item">
                <span className="countdown__number font-display">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="countdown__label">HOURS</span>
              </div>
              <span className="countdown__sep font-display">:</span>
              <div className="countdown__item">
                <span className="countdown__number font-display">{String(countdown.mins).padStart(2, '0')}</span>
                <span className="countdown__label">MINS</span>
              </div>
              <span className="countdown__sep font-display">:</span>
              <div className="countdown__item">
                <span className="countdown__number font-display">{String(countdown.secs).padStart(2, '0')}</span>
                <span className="countdown__label">SECS</span>
              </div>
            </div>
            <p className="prize-pool__next">Next draw: March 31st 2026</p>
            <Link to="/subscribe" className="prize-pool__cta">Enter This Month's Draw <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* Featured Charity */}
      <section className="featured-charity">
        <div className="featured-charity__image">
          <div className="featured-charity__image-placeholder">
            <span className="font-display">Community Impact</span>
          </div>
        </div>
        <div className="featured-charity__content">
          <span className="featured-charity__label">FEATURED CHARITY</span>
          <h2 className="featured-charity__name font-display">Children In Need Foundation</h2>
          <p className="featured-charity__desc">Supporting disadvantaged children across the UK through education, healthcare, and community programs. Every pound raised goes directly to programs that transform young lives.</p>
          <div className="featured-charity__impact">
            <span className="featured-charity__impact-value font-display">₹8,200</span>
            <span className="featured-charity__impact-label">raised by our community</span>
          </div>
          <Link to="/charities" className="featured-charity__link">Learn More <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* Charity Strip */}
      <section className="charity-strip">
        <div className="charity-strip__scroll">
          {['Heart Foundation', 'Youth Sports Trust', 'Cancer Research', 'Mental Health UK', 'Save the Children', 'Shelter', 'NSPCC'].map((name, i) => (
            <div key={i} className="charity-strip__item">
              <div className="charity-strip__initial">{name[0]}</div>
              <span className="charity-strip__name">{name}</span>
            </div>
          ))}
          <Link to="/charities" className="charity-strip__more">View All Charities <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container--wide">
          <span className="testimonials__quote font-display">"</span>
          <div className="testimonials__content">
            <p className="testimonials__text">{testimonials[testimonialIdx].quote}</p>
            <div className="testimonials__attr">
              <span className="testimonials__attr-line" />
              <div>
                <span className="testimonials__name">{testimonials[testimonialIdx].name}</span>
                <span className="testimonials__since">Member since {testimonials[testimonialIdx].since}</span>
              </div>
            </div>
          </div>
          <div className="testimonials__nav">
            <span className="testimonials__counter">{String(testimonialIdx + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
            <div className="testimonials__arrows">
              <button onClick={() => setTestimonialIdx(i => i === 0 ? testimonials.length - 1 : i - 1)} aria-label="Previous"><ChevronLeft size={20} /></button>
              <button onClick={() => setTestimonialIdx(i => (i + 1) % testimonials.length)} aria-label="Next"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
