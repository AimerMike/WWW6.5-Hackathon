import { useNavigate, useLocation } from 'react-router';
import backgroundImage from 'figma:asset/72231f1464b340d2245b2bbde298ee0c442dcab7.png';
import characterImage from 'figma:asset/bfee606d5dfec7a73890cb5b71e5c43e6c26854.png';
import cauldronImage from 'figma:asset/25105b31b346d820df525c421dd06be660cca0e5.png';
import collectButton from 'figma:asset/f103e578864ca4d98d1d93e32ca377df807381a.png';
import refineButton from 'figma:asset/bcc24e622f7079ba9837ab4380e8eb2c99b889d1.png';
import awakenButton from 'figma:asset/5042fea45ce6ca07d2d6371987ccbdb342fe1d29.png';
import profileButton from 'figma:asset/dd0fae2b566b4d9b18684364e779990d3e3e7890.png';
import owlImage from 'figma:asset/5dfb73f2e2092eb765b24ba8c1a852ce5f3731e9.png';
import alchemeLogo from 'figma:asset/a82dc1e92d5a60168dfc16bfe3402cf3da775301.png';
import crystalCabinet from 'figma:asset/9386d55d614184d987c9810f9d4db867147dc751.png';
import parchmentScroll from 'figma:asset/6e9c0278614ee59e3fa39d8a0594cbf4800e013a.png';
import { Sparkles, Flame } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';

import cardBg1 from 'figma:asset/36f068e9e853e013a326ddfeb3134365b8967d6f.png';
import cardBg2 from 'figma:asset/0beaaa20696396b0997d391dc1ed91d00f9eb7d8.png';
import cardBg3 from 'figma:asset/b24f257b05ef0a618e241f85ac4368499ebda3c0.png';

import stamp1 from 'figma:asset/09ac11079bc3070142d0c981f2a1e6f042ae75a2.png';
import stamp2 from 'figma:asset/d1ca70bd3631afc028f85c903ce19dacbbe493b9.png';
import stamp3 from 'figma:asset/981b85fbc4b9bb9aba7723567677e46e9d1a3fb8.png';

interface Crystal {
  id: number;
  color: string;
  gradient: string;
  image?: string;
}

export default function Refine() {
  const navigate = useNavigate();
  const location = useLocation();
  const refiningCount = location.state?.refiningCount || 0;
  const selectedOres = location.state?.selectedOres || [];
  
  const [totalCrystals, setTotalCrystals] = useState(0);
  const [showSmoke, setShowSmoke] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedStamp, setSelectedStamp] = useState(0);
  const [cardText, setCardText] = useState('');

  const cardBackgrounds = [cardBg1, cardBg2, cardBg3];
  const stampPatterns = [stamp1, stamp2, stamp3];

  // ==============================
  // 🔌 从接口拉取矿石总数
  // ==============================
  useEffect(() => {
    const loadOresCount = async () => {
      try {
        const res = await fetch("https://22bcdad4-a6ad-4285-adac-6e7d7e867c52-00-2rkqab45ars9.janeway.replit.dev/api/ores");
        const data = await res.json();
        setTotalCrystals (data.data?.length || 0);
      } catch (e) {
        const oresData = localStorage.getItem('collectedOres');
        const ores = oresData ? JSON.parse(oresData) : [];
        setTotalCrystals(ores.length);
      }
    };

    loadOresCount();
    const handleOresUpdate = () => loadOresCount();
    window.addEventListener('oresUpdated', handleOresUpdate);
    return () => window.removeEventListener('oresUpdated', handleOresUpdate);
  }, []);

  useEffect(() => {
    if (refiningCount > 0) {
      setSelectedCard(Math.floor(Math.random() * 3));
      setSelectedStamp(Math.floor(Math.random() * 3));
      setShowSmoke(true);
      setTimeout(() => {
        setShowCard(true);
      }, 3000);
    }
  }, [refiningCount]);

  // ==============================
  // 🔌 确认卡片 → 提交到后端 /api/cards
  // ==============================
  const handleConfirmCard = async () => {
    const newCard = {
      cardBgIndex: selectedCard,
      stampIndex: selectedStamp,
      text: cardText.trim(),
      ores: selectedOres.map((ore: any) => ({
        date: ore.date,
        content: ore.content
      }))
    };

    try {
      await fetch("https://22bcdad4-a6ad-4285-adac-6e7d7e867c52-00-2rkqab45ars9.janeway.replit.dev/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard)
      });
    } catch (err) {
      const cardsData = localStorage.getItem('refinedCards');
      const cards = cardsData ? JSON.parse(cardsData) : [];
      cards.push({ ...newCard, id: Date.now().toString(), date: new Date().toISOString() });
      localStorage.setItem('refinedCards', JSON.stringify(cards));
    }

    window.dispatchEvent(new Event('cardsUpdated'));
    setShowCard(false);
    setShowSmoke(false);
    setCardText('');
  };

  const [crystals] = useState<Crystal[]>([
    { id: 1, color: '#e91e63', gradient: 'linear-gradient(135deg, #f8bbd0 0%, #e91e63 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 2, color: '#10b981', gradient: 'linear-gradient(135deg, #a7f3d0 0%, #10b981 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 3, color: '#6366f1', gradient: 'linear-gradient(135deg, #c7d2fe 0%, #6366f1 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 4, color: '#f59e0b', gradient: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 5, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 6, color: '#06b6d4', gradient: 'linear-gradient(135deg, #cffafe 0%, #06b6d4 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 7, color: '#ec4899', gradient: 'linear-gradient(135deg, #fbcfe8 0%, #ec4899 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 8, color: '#14b8a6', gradient: 'linear-gradient(135deg, #99f6e4 0%, #14b8a6 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 9, color: '#f97316', gradient: 'linear-gradient(135deg, #fed7aa 0%, #f97316 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 10, color: '#a855f7', gradient: 'linear-gradient(135deg, #e9d5ff 0%, #a855f7 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 11, color: '#eab308', gradient: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
    { id: 12, color: '#3b82f6', gradient: 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)', image: 'https://images.unsplash.com/photo-1771580927643-36aaa2709141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200' },
  ]);

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
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${duration}s infinite ${delay}s`
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
              <img src={refineButton} alt="Refine" className="w-24 h-24 object-contain opacity-70" />
            </button>
            <button 
              onClick={() => navigate('/awaken')}
              className="hover:scale-110 transition-transform"
            >
              <img src={awakenButton} alt="Awaken" className="w-24 h-24 object-contain" />
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
              <ImageWithFallback 
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
            <div className="relative flex items-center justify-center" style={{ marginTop: '60px', marginLeft: '40px' }}>
              <div className="absolute inset-0 bg-gradient-radial from-purple-300/30 via-transparent to-transparent blur-2xl" />

              <div className="relative z-10 flex items-center justify-center">
                <img 
                  src={cauldronImage} 
                  alt="Magic Cauldron" 
                  className="w-full h-auto drop-shadow-2xl"
                  style={{
                    maxWidth: '300px',
                    filter: 'drop-shadow(0 15px 40px rgba(168, 85, 247, 0.4))'
                  }}
                />

                {showSmoke && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bottom-1/3 left-1/2 -translate-x-1/2"
                        style={{
                          animation: `smoke ${2 + Math.random() * 2}s ease-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: [
                            'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
                            'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%)',
                            'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%)',
                            'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, transparent 70%)',
                            'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%)',
                          ][i % 5],
                          filter: 'blur(20px)'
                        }}
                      />
                    ))}
                  </div>
                )}

                {[...Array(8)].map((_, i) => {
                  const duration = 2 + Math.random();
                  const delay = i * 0.2;
                  return (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                        top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                        animation: `sparkle ${duration}s ease-in-out infinite ${delay}s`
                      }}
                    >
                      <Sparkles className="text-yellow-400" size={16} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-4 flex flex-col items-center justify-start relative pt-4">
            <div className="relative w-full flex items-start justify-center gap-6 mb-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => navigate('/ore-collection')}
                  className="relative hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <img 
                    src={crystalCabinet} 
                    alt="Crystal Cabinet - Click to open" 
                    className="drop-shadow-2xl"
                    style={{
                      height: '160px',
                      width: 'auto',
                      filter: 'drop-shadow(0 10px 30px rgba(101, 67, 33, 0.5))'
                    }}
                  />
                </button>

                <div className="mt-2 whitespace-nowrap">
                  <span 
                    className="text-xs animate-pulse"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: '#8b6914',
                      textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                      fontWeight: 600
                    }}
                  >
                    Click
                  </span>
                </div>
              </div>

              <div className="relative z-10">
                <img 
                  src={owlImage} 
                  alt="Steampunk Owl" 
                  className="w-40 h-40 object-contain drop-shadow-2xl"
                  style={{
                    animation: 'owlFloat 3.5s ease-in-out infinite'
                  }}
                />
              </div>
            </div>

            <div className="relative w-full max-w-xs flex flex-col items-center">
              <div className="relative w-full" style={{ marginTop: '-50px' }}>
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
                      Total Ores
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
                      {totalCrystals}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <div 
            className="relative flex items-center gap-8"
            style={{
              animation: 'cardZoomIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="relative flex flex-col items-center">
              <div 
                className="relative"
                style={{
                  width: '500px',
                  height: 'auto'
                }}
              >
                <img 
                  src={cardBackgrounds[selectedCard]}
                  alt="Card"
                  className="w-full h-auto drop-shadow-2xl"
                />

                <div 
                  className="absolute"
                  style={{
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '180px',
                    height: '180px'
                  }}
                >
                  <img 
                    src={stampPatterns[selectedStamp]}
                    alt="Stamp"
                    className="w-full h-full object-contain"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 w-full max-w-md">
                <textarea
                  value={cardText}
                  onChange={(e) => setCardText(e.target.value)}
                  placeholder="Create your milestone card..."
                  className="w-full px-6 py-4 rounded-xl resize-none"
                  rows={4}
                  style={{
                    background: 'rgba(255, 250, 235, 0.9)',
                    border: '3px solid #8b6914',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '1rem',
                    color: '#3d2817',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.5)'
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleConfirmCard}
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
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateX(-50%) translateY(0px) rotateZ(-5deg);
          }
          50% {
            transform: translateX(-50%) translateY(-15px) rotateZ(-8deg);
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes smoke {
          0% {
            transform: translateY(0) translateX(-50%) scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-300px) translateX(-50%) scale(2);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes cardZoomIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes owlFloat {
          0%, 100% {
            transform: translateX(-50%) translateY(0px) rotateZ(-5deg);
          }
          50% {
            transform: translateX(-50%) translateY(-15px) rotateZ(-8deg);
          }
        }
      `}</style>
    </div>
  );
}
