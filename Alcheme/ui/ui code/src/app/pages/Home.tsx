import { useNavigate } from 'react-router';
import backgroundImage from '../../assets/72231f1464b340d2245b2bbde298ee0c442dcab7.png';
import characterImage from '../../assets/bfee606d5dfec7a73890cb51b71e5c43e6c26854.png';
import crystalImage from '../../assets/3426c04b68d9b86397088a381e18adf4fa12dca2.png';
import magicOrbsImage from '../../assets/28caacd1fffa5b73fafec6bbbc5a0ce3c9ecd880.png';
import collectButton from '../../assets/f103e578864ca4d98d1d93e72ca377df8077381a.png';
import refineButton from '../../assets/bcc24e622f7079ba9837ab4380e8eb2c99b889d1.png';
import awakenButton from '../../assets/5042fea45ce6ca07d2d6371987ccbdb342fe1d29.png';
import profileButton from '../../assets/dd0fae2b566b4d9b18684364e779990d3e3e7890.png';
import owlImage from '../../assets/5dfb73f2e2092eb765b24ba8c1a852ce5f3731e9.png';
import alchemeLogo from '../../assets/a82dc1e92d5a60168dfc16bfe3402cf3da775301.png';
import parchmentScroll from '../../assets/6e9c0278614ee59e3fa39d8a0594cbf4800e013a.png';
import { Sparkles } from 'lucide-react';

import crystal1 from '../../assets/6e4310e7eedb7599a8783ae85915384fa1cdb41a.png';
import crystal2 from '../../assets/c9271aa2b5c4b3ac4fd8114695354054ec89c320.png';
import crystal3 from '../../assets/422998f75fa5b2894d6c25e42f9caa86c99f9321.png';
import crystal4 from '../../assets/4a6ca87b1626e3188c8da1e6e3437313330918fd.png';
import crystal5 from '../../assets/4331dd7b68e3e3da6cc1381fab0958d10762790c.png';
import crystal6 from '../../assets/83aeacc4fc141482124734bd80a9fc84f4b2c521.png';
import crystal7 from '../../assets/631bbd517278741d8b4593c3ac1af0dc44681864.png';

export default function Home() {
  const navigate = useNavigate();

  const crystalIcons = [crystal1, crystal2, crystal3, crystal4, crystal5, crystal6, crystal7];

  // ==============================
  // 🔌 只改这里：对接采集矿石接口
  // ==============================
  const handleCollect = async (taskName: string) => {
    try {
      const res = await fetch("/api/mine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "任务采集",
          content: taskName
        })
      });

      await res.json();
      window.dispatchEvent(new Event('oresUpdated'));
      alert("采集成功");
    } catch (e) {
      // 本地兜底
      const oresData = localStorage.getItem('collectedOres');
      const ores = oresData ? JSON.parse(oresData) : [];
      
      const newOre = {
        id: `ore-${Date.now()}`,
        type: 'task',
        content: taskName,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
      };
      
      ores.push(newOre);
      localStorage.setItem('collectedOres', JSON.stringify(ores));
      window.dispatchEvent(new Event('oresUpdated'));
    }
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
              <img src={collectButton} alt="Collect" className="w-24 h-24 object-contain opacity-70" />
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
              onClick={() => navigate('/mine')}
              className="relative hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img 
                src={crystalImage} 
                alt="Magic Crystal - Click to enter mine" 
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  maxWidth: '300px',
                  filter: 'drop-shadow(0 15px 40px rgba(168, 85, 247, 0.4))',
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
              <div className="absolute inset-0 bg-gradient-radial from-purple-300/30 via-transparent to-transparent blur-2xl" />
              
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span 
                  className="text-sm animate-pulse"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: '#8b5cf6',
                    textShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                  }}
                >
                  Click to enter mine
                </span>
              </div>
            </button>
            
            <div className="relative mt-8">
              <img 
                src={magicOrbsImage} 
                alt="Magic Orbs" 
                className="w-full h-auto drop-shadow-xl"
                style={{
                  maxWidth: '280px'
                }}
              />
            </div>
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
                  <div className="space-y-5 w-full">
                    {[
                      'Read: Walden',
                      'Run: 5km',
                      'Meditation: 30m'
                    ].map((task, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <img 
                            src={crystalIcons[idx % crystalIcons.length]}
                            alt="crystal"
                            className="w-6 h-6 object-contain drop-shadow-sm"
                          />
                          <span 
                            style={{ 
                              fontFamily: "'Cinzel', serif",
                              color: '#3d2817',
                              fontSize: '1.05rem',
                              fontWeight: 500,
                              textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)'
                            }}
                          >
                            {task}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleCollect(task)}
                          className="hover:scale-105 transition-all hover:shadow-md flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #f4d03f 0%, #daa520 100%)',
                            border: '2px solid #8b6914',
                            borderRadius: '6px',
                            padding: '4px 12px',
                            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Cinzel', serif",
                              color: '#3d2817',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Collect
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes owlFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
