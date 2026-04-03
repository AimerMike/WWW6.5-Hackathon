import { useNavigate, useSearchParams } from 'react-router';
import backgroundImage from '../../assets/72231f1464b340d2245b2bbde298ee0c442dcab7.png';
import characterImage from '../../assets/bfee606d5dfec7a73890cb51b71e5c43e6c26854.png';
import collectButton from '../../assets/f103e578864ca4d98d1d93e72ca377df8077381a.png';
import refineButton from '../../assets/bcc24e622f7079ba9837ab4380e8eb2c99b889d1.png';
import awakenButton from '../../assets/5042fea45ce6ca07d2d6371987ccbdb342fe1d29.png';
import profileButton from '../../assets/dd0fae2b566b4d9b18684364e779990d3e3e7890.png';
import owlImage from '../../assets/5dfb73f2e2092eb765b24ba8c1a852ce5f3731e9.png';
import alchemeLogo from '../../assets/a82dc1e92d5a60168dfc16bfe3402cf3da775301.png';
import parchmentScroll from '../../assets/6e9c0278614ee59e3fa39d8a0594cbf4800e013a.png';
import awakenDoor from '../../assets/dacf8af5f4cb3701c8f630102721791cf2d07102.png';
import medalImage from '../../assets/99b83df7ca82c99f905eaf13a84586014ff41499.png';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

import cardBg1 from '../../assets/36f068e9e853e013a326ddfeb3134365b8967d6f.png';
import cardBg2 from '../../assets/0beaaa20696396b0997d391dc1ed91d00f9eb7d8.png';
import cardBg3 from '../../assets/b24f257b05ef0a618e241f85ac4368499ebda3c0.png';

import stamp1 from '../../assets/09ac11079bc3070142d0c981f2a1e6f042ae75a2.png';
import stamp2 from '../../assets/d1ca70bd3631afc028f85c903ce19dacbbe493b9.png';
import stamp3 from '../../assets/981b85fbc4b9bb9aba7723567677e46e9d1a3fb8.png';

interface Card {
  id: string;
  cardBgIndex: number;
  stampIndex: number;
  text: string;
  date: string;
  ores?: Array<{
    date: string;
    content: string;
  }>;
}

export default function Awaken() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [totalCards, setTotalCards] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [medalText, setMedalText] = useState('');
  const [showMedalInput, setShowMedalInput] = useState(false);

  const cardBackgrounds = [cardBg1, cardBg2, cardBg3];
  const stampPatterns = [stamp1, stamp2, stamp3];

  // ==============================
  // 🔌 接口：从后端获取卡片数量
  // ==============================
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("/api/cards");
        const data = await res.json();
        setTotalCards(data.data?.length || 0);
      } catch (e) {
        const local = localStorage.getItem('refinedCards');
        setTotalCards(local ? JSON.parse(local).length : 0);
      }
    };

    fetchCards();

    const handleCardsUpdate = () => fetchCards();
    window.addEventListener('cardsUpdated', handleCardsUpdate);
    return () => window.removeEventListener('cardsUpdated', handleCardsUpdate);
  }, []);

  useEffect(() => {
    if (searchParams.get('showAnimation') === 'true') {
      const awakenCardsData = localStorage.getItem('awakenCards');
      if (awakenCardsData) {
        const cards = JSON.parse(awakenCardsData);
        setSelectedCards(cards);
        setShowAnimation(true);
        
        setTimeout(() => setAnimationPhase(1), 500);
        setTimeout(() => setAnimationPhase(2), 3000);
        setTimeout(() => setShowMedalInput(true), 4500);
      }
    }
  }, [searchParams]);

  // ==============================
  // 🔌 接口：铸造勋章（对接后端）
  // ==============================
  const handleConfirmMedal = async () => {
    try {
      const cardIds = selectedCards.map(c => c.id);
      await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: medalText,
          cardIds: cardIds,
          uploadToIpfs: true
        })
      });

      // 本地同步清理
      const allCards = JSON.parse(localStorage.getItem('refinedCards') || '[]');
      const remaining = allCards.filter((c: Card) => !cardIds.includes(c.id));
      localStorage.setItem('refinedCards', JSON.stringify(remaining));
      setTotalCards(remaining.length);
      window.dispatchEvent(new Event('cardsUpdated'));

      // 保存勋章
      const medals = JSON.parse(localStorage.getItem('awakenedMedals') || '[]');
      medals.push({
        id: `medal-${Date.now()}`,
        text: medalText,
        date: new Date().toISOString(),
        cards: selectedCards
      });
      localStorage.setItem('awakenedMedals', JSON.stringify(medals));

    } catch (e) {
      console.log("铸造接口异常，使用本地模式");
    }

    // 重置动画
    localStorage.removeItem('awakenCards');
    setShowAnimation(false);
    setAnimationPhase(0);
    setMedalText('');
    setShowMedalInput(false);
    setSelectedCards([]);
    navigate('/awaken');
  };

  return (
    <div 
      className="w-full h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        width: '1920px',
        height: '1080px',
        maxWidth: '1920px',
        maxHeight: '1080px',
        margin: '0 auto',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Cormorant Garamond', serif"
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const duration = 2 + Math.random() * 3;
          const delay = Math.random() * 2;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationName: 'pulse',
                animationDuration: `${duration}s`,
                animationIterationCount: 'infinite',
                animationDelay: `${delay}s`
              }}
            >
              <Sparkles 
                className="text-white/30" 
                size={Math.random() * 10 + 8}
              />
            </div>
          );
        })}
      </div>

      <div className="relative w-full max-w-7xl bg-gradient-to-br from-purple-100/40 via-pink-50/30 to-cyan-100/40 rounded-3xl shadow-2xl border-4 border-amber-200/60 backdrop-blur-sm p-8">
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <img 
              src={alchemeLogo} 
              alt="Alcheme" 
              className="h-32 w-auto"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/')}
              className="hover:scale-110 transition-transform"
            >
              <img src={collectButton} alt="Collect" className="w-24 h-24 object-contain" />
            </button>
            <button 
              onClick={() => navigate('/refine')}
              className="hover:scale-110 transition-transform"
            >
              <img src={refineButton} alt="Refine" className="w-24 h-24 object-contain" />
            </button>
            <button 
              onClick={() => navigate('/awaken')}
              className="hover:scale-110 transition-transform"
            >
              <img src={awakenButton} alt="Awaken" className="w-24 h-24 object-contain opacity-70" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="hover:scale-110 transition-transform"
            >
              <img src={profileButton} alt="Profile" className="w-24 h-24 object-contain" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 mt-8">
          
          <div className="col-span-4 flex items-center justify-center">
            <div className="relative">
              <img 
                src={characterImage}
                alt="Alchemist Character" 
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  maxHeight: '500px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.3))'
                }}
              />
            </div>
          </div>

          <div className="col-span-4 flex flex-col items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/card-gallery')}
              className="relative hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{
                transform: 'scale(1.5)',
                transformOrigin: 'bottom center'
              }}
            >
              <img 
                src={awakenDoor} 
                alt="Mystical Door - Click to see milestone cards" 
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  maxWidth: '300px',
                  filter: 'drop-shadow(0 15px 40px rgba(139, 92, 246, 0.5))',
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
              <div className="absolute inset-0 bg-gradient-radial from-purple-300/30 via-transparent to-transparent blur-2xl" />
              
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span 
                  className="text-sm animate-pulse"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: '#8b6914',
                    textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  Click to see your milestone cards
                </span>
              </div>
            </button>
          </div>

          <div className="col-span-4 flex flex-col items-center justify-start relative pt-4">
            <div className="relative w-full max-w-xs flex flex-col items-center">
              <div className="relative z-10 mb-[-30px]">
                <img 
                  src={owlImage} 
                  alt="Steampunk Owl" 
                  className="w-40 h-40 object-contain drop-shadow-2xl"
                  style={{
                    animation: 'owlFloat 3.5s ease-in-out infinite'
                  }}
                />
              </div>

              <div className="relative w-full">
                <img 
                  src={parchmentScroll} 
                  alt="Parchment Scroll" 
                  className="w-full h-auto drop-shadow-xl"
                />
                
                <div className="absolute inset-0 flex items-center justify-center px-12 py-12">
                  <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <div 
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: '#8b6914',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                        letterSpacing: '1px'
                      }}
                    >
                      Total Cards
                    </div>

                    <div 
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: '#3d2817',
                        fontSize: '3rem',
                        fontWeight: 900,
                        textShadow: '0 2px 4px rgba(255, 255, 255, 0.6)',
                        lineHeight: '1'
                      }}
                    >
                      {totalCards}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {(animationPhase === 0 || animationPhase === 1) && (
              <div className="relative w-96 h-96">
                {selectedCards.map((card, idx) => {
                  const totalCards = selectedCards.length;
                  const angle = (idx * 360) / totalCards;
                  const radius = 200;
                  
                  return (
                    <div
                      key={card.id}
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `
                          translate(-50%, -50%)
                          rotate(${angle}deg)
                          translateY(-${radius}px)
                          ${animationPhase === 1 ? 'rotate(-' + angle + 'deg)' : ''}
                        `,
                        animation: animationPhase === 1 ? 'cardRotate 4s linear infinite' : 'cardFlyIn 0.8s ease-out',
                        animationDelay: animationPhase === 0 ? `${idx * 0.1}s` : '0s',
                        width: '120px',
                        height: '160px'
                      }}
                    >
                      <div 
                        className="relative w-full h-full rounded-lg shadow-2xl"
                        style={{
                          transform: animationPhase === 1 ? `rotate(${angle * 2}deg)` : 'rotate(0deg)',
                          transition: 'transform 4s linear'
                        }}
                      >
                        <img 
                          src={cardBackgrounds[card.cardBgIndex]}
                          alt="Card"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div 
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{
                            width: '60px',
                            height: '60px'
                          }}
                        >
                          <img 
                            src={stampPatterns[card.stampIndex]}
                            alt="Stamp"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
              </div>
            )}

            {animationPhase >= 2 && (
              <div className="flex flex-col items-center gap-6 pointer-events-auto">
                <div 
                  className="relative"
                  style={{
                    animation: 'medalAppear 1s ease-out',
                    width: '400px',
                    height: '400px'
                  }}
                >
                  <img 
                    src={medalImage}
                    alt="Medal"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                  
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: '400px',
                        height: '4px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.6) 50%, transparent 100%)',
                        transform: `rotate(${i * 30}deg)`,
                        animation: 'rayRotate 3s linear infinite',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>

                {showMedalInput && (
                  <div className="flex flex-col items-center gap-4">
                    <textarea
                      value={medalText}
                      onChange={(e) => setMedalText(e.target.value)}
                      placeholder="Build your medal..."
                      className="w-96 h-32 px-4 py-3 rounded-xl resize-none"
                      style={{
                        background: 'rgba(255, 250, 235, 0.9)',
                        border: '3px solid #8b6914',
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1rem',
                        color: '#3d2817',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.5)'
                      }}
                    />
                    
                    <button
                      onClick={handleConfirmMedal}
                      className="hover:scale-110 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #f4d03f 0%, #daa520 100%)',
                        border: '4px solid #8b6914',
                        borderRadius: '16px',
                        padding: '20px 40px',
                        boxShadow: '0 8px 24px rgba(218, 165, 32, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4)'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Cinzel', serif",
                          color: '#3d2817',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          letterSpacing: '2px',
                          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        CONFIRM
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes cardFlyIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes cardRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateY(-200px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateY(-200px); }
        }
        @keyframes medalAppear {
          0% { opacity: 0; transform: scale(0.3) rotate(-180deg); }
          50% { transform: scale(1.1) rotate(10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes rayRotate {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        @keyframes owlFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
