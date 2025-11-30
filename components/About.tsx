import React from 'react';
import { ServiceItem } from '../types';

const services: ServiceItem[] = [
  {
    title: "Skills",
    description: "The main skills I have to offer",
    tags: ["2D Art", "3D Modelling", "Photography", "Concepting", "Game Design"]
  },
  {
    title: "Games",
    description: "My favourite Games that inspire my work",
    tags: ["Stanley Parable", "Geoguessr", "Minecraft" , "Call Of Duty", "Sherlock Holmes: Chapter One"]
  },
  {
    title: "Tools",
    description: "Tools and Software I frequently use",
    tags: ["UE5", "Gaea", "Photoshop", "Blender", "3DS Max", "Substance Painter", "After Effects", "Premiere Pro"]
  }
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-studio-zinc text-white relative overflow-hidden z-50">
      <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
          <div>
            <div className="inline-block relative z-40">
              <h2 className="text-4xl md:text-6xl mb-6 text-white typewriter font-mono" style={{ fontFamily: `'JMH Typewriter', "Courier New", Courier, monospace`, animationDelay: '200ms' }}>Who am I?</h2>
              <div className="w-full h-1 bg-accent shadow-glow mb-6 animate-fade-in-up" style={{ animationDelay: '380ms' }}></div>
            </div>
            <p className="text-lg md:text-xl leading-relaxed font-light text-gray-300 animate-fade-in-up" style={{ animationDelay: '560ms' }}>
              <br /><br /> 
              ShelfStudios is solely ran by <span className="text-accent font-mono">&lt;Cadan&gt;</span>.
              <br /><br />   
              What started from my love of <span className="hl-creativity font-mono">&lt;Creativity&gt;</span>, <span className="hl-gaming font-mono">&lt;Gaming&gt;</span> and <span className="hl-tech font-mono">&lt;Tech&gt;</span> soon spiralled into taking relevant GCSE's, such as Film Studies, Photography and Computer Science.
              From there I took a college course studying VFX, Animation & Game's Design which taught me the fundamentals of 3D Modelling, Digital art and using Game Engines such as Unreal Engine.
              Now, I am studying Game's Art & Design at university hoping to enhance these skills further. I have always enjoyed learning and being creative so continuing education in this field was the right thing to do.
              <br /><br />
              Outside of ShelfStudios, I enjoy gaming, Streaming / Creating Content, starting small projects and exploring new tech.
              Feel free to reach out for collaborations, projects or just a friendly chat about all things creative and tech!
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group p-8 border border-accent/50 bg-black shadow-glow transition-transform duration-500 rounded-sm animate-fade-in-up md:border-white/10 md:bg-black/50 md:!shadow-none md:hover:border-accent/50 md:hover:bg-black md:hover:shadow-glow`} 
                style={{ animationDelay: `${index * 120}ms`, transformStyle: 'preserve-3d' }}
              >
                <h3 className="text-2xl font-bold mb-4 text-accent md:text-white md:group-hover:text-accent transition-colors">{service.title}</h3>
                <p className="text-gray-200 md:text-gray-400 mb-6 leading-relaxed md:group-hover:text-gray-200 transition-colors">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider border border-accent/50 px-2 py-1 text-accent font-mono transition-colors md:border-white/10 md:text-gray-500 md:group-hover:border-accent md:group-hover:text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;