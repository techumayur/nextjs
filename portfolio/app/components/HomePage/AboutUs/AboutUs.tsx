"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { parseHtml, wpAutop } from '@/app/lib/parseHtml';
import './about-us.css';

interface TerminalLine {
  text: string;
  type: 'info' | 'command' | 'output' | 'error';
  isAnimated?: boolean;
}

interface TerminalCommand {
  command: string;
  output: string;
}

interface TerminalGroup {
  title?: string;
  lines?: TerminalLine[];
  placeholder?: string;
  commands?: TerminalCommand[];
}

export interface AboutUsData {
  sub_heading?: string;
  profile_image?: string;
  name?: string;
  designation?: string;
  description?: string;
  features?: {
    icon?: string;
    title?: string;
  }[];
  primary_button_label?: string;
  primary_button_link?: string;
  secondary_button_label?: string;
  secondary_button_link?: string;
  terminal?: TerminalGroup;
  terminal_role?: string;
  terminal_name?: string;
  terminal_experience?: string;
  terminal_location?: string;
  terminal_email?: string;
  terminal_skills?: { skill: string }[];
}

// Sub-component for typing effect
const TypewriterText = ({ text, delay = 20, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return <>{displayedText}</>;
};

export default function AboutUs({ data }: { data?: AboutUsData }) {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true);
  
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalLines, inputValue]);

  const clearTerminal = useCallback(() => {
    setTerminalLines([]);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent | null, manualCommand?: string) => {
    if (e) e.preventDefault();
    
    const processCommand = (commandText: string) => {
      const trimmed = commandText.trim();
      if (!trimmed) return;

      const commandLower = trimmed.toLowerCase();
      const echoLine: TerminalLine = { text: `➜ ${trimmed}`, type: 'command' };
      let responseLines: TerminalLine[] = [];

      if (commandLower === 'clear') {
        clearTerminal();
        return;
      }

      const commands = Array.isArray(data?.terminal?.commands) ? data.terminal.commands : [];

      if (commandLower === 'help') {
        const customLines = commands.map(c => ({ 
          text: `${c.command} - Project highlight`, 
          type: 'info' as const, 
          isAnimated: true 
        }));

        responseLines = [
          { text: "Available commands:", type: 'info', isAnimated: true },
          { text: "clear - Clear the terminal", type: 'info', isAnimated: true },
          { text: "help - Show available commands", type: 'info', isAnimated: true },
          ...customLines
        ];
      } else {
        const customCommand = commands.find(c => c.command && c.command.toLowerCase() === commandLower);
        if (customCommand) {
          responseLines = [{ text: customCommand.output, type: 'output', isAnimated: true }];
        } else {
          responseLines = [{ 
            text: `Command not found: ${trimmed}. Type 'help' for available commands.`, 
            type: 'error', 
            isAnimated: true 
          }];
        }
      }

      setTerminalLines(prev => [...prev, echoLine, ...responseLines]);
      setIsTyping(true);
    };

    if (manualCommand) {
      processCommand(manualCommand);
    } else {
      processCommand(inputValue);
      setInputValue("");
    }
  }, [data, clearTerminal, inputValue]);

  const showHelp = useCallback(() => {
    const commands = Array.isArray(data?.terminal?.commands) ? data.terminal.commands : [];
    const customLines = commands.map(c => ({ 
      text: `${c.command} - Project highlight`, 
      type: 'info' as const, 
      isAnimated: true 
    }));

    setTerminalLines(prev => [
      ...prev,
      { text: "Available commands:", type: 'info', isAnimated: true },
      { text: "clear - Clear the terminal", type: 'info', isAnimated: true },
      { text: "help - Show available commands", type: 'info', isAnimated: true },
      ...customLines
    ]);
    setIsTyping(true);
  }, [data]);

  // SEQUENTIAL STARTUP
  useEffect(() => {
    if (playheadRef.current) return;
    
    // Safety check: if data exists but terminal group is missing, we can still show a fallback
    if (!data) return;
    
    const terminalData = data?.terminal;
    playheadRef.current = true;

    let isMounted = true;
    
    const startTerminal = async () => {
      while (isMounted) {
        setTerminalLines([]);
        setIsTyping(true);
        setInputValue("");
        
        // 1. Initial Lines
        let initialLines = terminalData?.lines || [];
        
        // Fallback: Try to reconstruct lines from individual fields if group is missing
        if (initialLines.length === 0) {
          if (data.terminal_role) initialLines.push({ text: `Role: ${data.terminal_role}`, type: 'info' });
          if (data.terminal_name) initialLines.push({ text: `Name: ${data.terminal_name}`, type: 'info' });
          if (data.terminal_location) initialLines.push({ text: `Location: ${data.terminal_location}`, type: 'info' });
          if (data.terminal_experience) initialLines.push({ text: `Experience: ${data.terminal_experience}`, type: 'info' });
          if (data.terminal_email) initialLines.push({ text: `Email: ${data.terminal_email}`, type: 'info' });
          
          if (data.terminal_skills && Array.isArray(data.terminal_skills)) {
            const skillsList = data.terminal_skills.map(s => s.skill).join(', ');
            if (skillsList) initialLines.push({ text: `Skills: ${skillsList}`, type: 'info' });
          }
        }

        if (initialLines.length === 0) {
          // Ultimate fallback
          setTerminalLines([{ text: "Welcome to About Terminal v1.1.0", type: 'info', isAnimated: true }]);
          await new Promise(r => setTimeout(r, 1000));
        } else {
          for (const line of initialLines) {
            if (!isMounted) break;
            setTerminalLines(prev => [...prev, { ...line, isAnimated: true }]);
            await new Promise(r => setTimeout(r, (line.text.length * 20) + 400));
          }
        }

        if (!isMounted) break;
        await new Promise(r => setTimeout(r, 800));

        // 2. Automated command cycle (One by one, slideshow style)
        const commands = terminalData?.commands || [];
        for (const cmd of commands) {
          if (!isMounted) break;
          
          // Brief pause before command
          await new Promise(r => setTimeout(r, 1000));
          
          setInputValue("");
          for (let i = 0; i < cmd.command.length; i++) {
            if (!isMounted) break;
            setInputValue(cmd.command.slice(0, i + 1));
            await new Promise(r => setTimeout(r, 60));
          }
          
          if (!isMounted) break;
          await new Promise(r => setTimeout(r, 400));
          handleSubmit(null, cmd.command);
          setInputValue("");
          
          // Wait for output to be "read"
          await new Promise(r => setTimeout(r, (cmd.output.length * 15) + 3000));
        }

        if (!isMounted) break;
        setIsTyping(false); 
        
        // Wait 5 seconds before restarting the loop
        await new Promise(r => setTimeout(r, 5000));
      }
    };

    startTerminal();
    return () => { 
      isMounted = false; 
      playheadRef.current = false;
    };
  }, [data, handleSubmit, clearTerminal]);

  // Focus input when typing finishes without jumping the page (Desktop only)
  useEffect(() => {
    if (!isTyping && terminalInputRef.current) {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      if (!isMobile) {
        terminalInputRef.current.focus({ preventScroll: true });
      }
    }
  }, [isTyping]);

  if (!data) return null;

  return (
    <section id="home-about-us" className="about-us-section section-spacing">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 order-2 order-lg-1">
            <div className="terminal-section">
              <div className={`terminal-window ${isLightMode ? 'light-mode' : ''}`} id="terminalWindow" onClick={() => terminalInputRef.current?.focus({ preventScroll: true })}>
                <div className="terminal-header">
                  <div className="terminal-buttons">
                    <div className="terminal-btn btn-close-terminal"></div>
                    <div className="terminal-btn btn-minimize"></div>
                    <div className="terminal-btn btn-maximize"></div>
                  </div>
                  <div className="terminal-title">{data.terminal?.title || "bash - about.sh"}</div>
                  <div className="terminal-actions">
                    <button className="terminal-action-btn" onClick={(e) => { e.stopPropagation(); clearTerminal(); }}>Clear</button>
                    <button className="terminal-action-btn" onClick={(e) => { e.stopPropagation(); showHelp(); }}>Help</button>
                    <button className={`mode-toggle ${isLightMode ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setIsLightMode(!isLightMode); }} id="modeToggle" title="Toggle Dark/Light Mode">
                      <div className="mode-toggle-slider">
                        {!isLightMode ? (
                          <svg id="moonIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                          </svg>
                        ) : (
                          <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
                            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
                            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
                            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                <div className="terminal-body" id="terminalOutput" ref={terminalBodyRef}>
                  {terminalLines.map((line, idx) => (
                    <div key={idx} className={`terminal-line terminal-${line.type}`}>
                      {line.type === 'command' ? (
                        <>
                          <span className="terminal-prompt">➜</span>{" "}
                          <span className="terminal-command">{line.text.replace('➜ ', '')}</span>
                        </>
                      ) : (
                        line.isAnimated ? (
                          <TypewriterText text={line.text} />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: parseHtml(line.text) }} />
                        )
                      )}
                    </div>
                  ))}
                  <form onSubmit={(e) => handleSubmit(e)} className="terminal-input-line">
                    <span className="terminal-prompt">➜</span>
                    <input 
                      ref={terminalInputRef}
                      type="text" 
                      className="terminal-input" 
                      id="terminalInput" 
                      placeholder={data.terminal?.placeholder || "Type a command..."}
                      autoComplete="off" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <span className="cursor"></span>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 order-1 order-lg-2">
            <div className="sub-heading-tag-1">
              <div className="sub-heading-image">
                {data?.profile_image && (
                  <picture>
                    <Image src={data.profile_image} alt={data?.name || ""} width={20} height={20} loading="lazy" className="img-fluid" style={{ height: 'auto' }} unoptimized />
                  </picture>
                )}
              </div>
              <div dangerouslySetInnerHTML={{ __html: parseHtml(data?.sub_heading) }} />
            </div>
            <div className="profile-section">
              <div className="profile-info">
                {data?.profile_image && (
                  <div className="profile-image">
                    <picture>
                      <Image src={data.profile_image} alt={data?.name || ""} width={45} height={45} loading="lazy" className="img-fluid" style={{ height: 'auto' }} unoptimized />
                    </picture>
                  </div>
                )}
                <div className="profile-content">
                  {data?.name && (
                    <h2 dangerouslySetInnerHTML={{ __html: parseHtml(data.name) }}></h2>
                  )}
                  {data?.designation && <p>{data.designation}</p>}
                </div>
              </div>
              {data?.description && (
                <div className="about-us-content" dangerouslySetInnerHTML={{ __html: wpAutop(data.description) }} />
              )}
              <div className="row g-4 mb-4">
                {data?.features && data.features.length > 0 && (
                  data.features.map((feature, index) => (
                    <div key={index} className={`col-${index === 2 ? '12' : '6'} col-lg-4`}>
                      <div className={`feature-card card-${index + 1}`}>
                        <div className="icon-wrapper">
                          {feature.icon && (
                            <picture>
                              <Image src={feature.icon} alt={feature.title || `Feature`} width={30} height={30} className="img-fluid" style={{ height: 'auto' }} loading="lazy" unoptimized />
                            </picture>
                          )}
                        </div>
                        <h3 className="card-title">{feature.title}</h3>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="about-us-btn-group pt-3">
                {data?.primary_button_label && (
                  <a href={data?.primary_button_link || "#"} className="primary-btn">
                    <span className="primary-btn-icon">
                      <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                      </svg>
                      <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                      </svg>
                    </span>
                    {data.primary_button_label}
                  </a>
                )}
                {data?.secondary_button_label && (
                  <a href={data?.secondary_button_link || "#"} className="secondary-btn">
                    <span>{data.secondary_button_label}</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                      <path d="M1,5 L11,5"></path>
                      <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}