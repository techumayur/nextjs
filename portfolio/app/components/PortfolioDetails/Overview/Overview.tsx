"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { parseHtml } from '@/app/lib/parseHtml';
import './Overview.css';

interface TerminalLine {
  text: string;
  type: 'info' | 'command' | 'output';
  isAnimated?: boolean;
}

interface OverviewProps {
  subHeading?: string;
  heading?: string;
  highlightText?: string;
  myRole?: {
    contribution?: string;
    technologies?: string;
    deliverables?: string;
  };
  liveLink?: string;
  terminal?: {
    title: string;
    lines: TerminalLine[];
    placeholder: string;
    commands: {
      command: string;
      output: string;
    }[];
  };
}

// Typewriter Component for a single line (Synchronized with Home Page logic)
const TypewriterText = ({ text, speed = 20, onComplete }: { text: string; speed?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <>{displayedText}</>;
};

const Overview: React.FC<OverviewProps> = ({
  subHeading,
  heading,
  highlightText,
  myRole,
  liveLink,
  terminal
}) => {
  const [isLightMode, setIsLightMode] = useState(true);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const playheadRef = useRef<string | null>(null); // Track WHICH terminal we are playing to handle navigation
  const inputValRef = useRef(""); // Use a ref to keep handleSubmit stable

  const toggleMode = () => setIsLightMode(!isLightMode);

  const updateInputValue = (val: string) => {
    setInputValue(val);
    inputValRef.current = val;
  };

  const clearTerminal = useCallback(() => {
    setTerminalLines([]);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent | null, manualCommand?: string) => {
    if (e) e.preventDefault();

    const commandToProcess = manualCommand !== undefined ? manualCommand : inputValRef.current;

    const processCommand = (commandText: string) => {
      const trimmed = commandText.trim();
      if (!trimmed) return;

      const commandLower = trimmed.toLowerCase();
      // Keep prompt out of the text string to match Home Page logic
      const echoLine: TerminalLine = { text: trimmed, type: 'command' };
      let responseLines: TerminalLine[] = [];

      if (commandLower === 'clear') {
        clearTerminal();
        return;
      }

      const commands = Array.isArray(terminal?.commands) ? terminal.commands : [];

      if (commandLower === 'help') {
        const customLines = commands.map(c => ({
          text: `${c.command} - Custom project command`,
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
            type: 'info',
            isAnimated: true
          }];
        }
      }

      setTerminalLines(prev => [...prev, echoLine, ...responseLines]);
      setIsTyping(true);
    };

    processCommand(commandToProcess);
    if (manualCommand === undefined) {
      updateInputValue("");
    }
  }, [terminal, clearTerminal]);

  const showHelp = useCallback(() => {
    const customLines = Array.isArray(terminal?.commands)
      ? terminal.commands.map(c => ({ text: `${c.command} - Custom project command`, type: 'info' as const, isAnimated: true }))
      : [];

    setTerminalLines(prev => [
      ...prev,
      { text: "Available commands:", type: 'info', isAnimated: true },
      { text: "clear - Clear the terminal", type: 'info', isAnimated: true },
      { text: "help - Show available commands", type: 'info', isAnimated: true },
      ...customLines
    ]);
    setIsTyping(true);
  }, [terminal]);

  // Focus input when typing finishes without jumping the page (Desktop only)
  useEffect(() => {
    if (!isTyping && terminalInputRef.current) {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      if (!isMobile) {
        terminalInputRef.current.focus({ preventScroll: true });
      }
    }
  }, [isTyping]);

  // SEQUENTIAL STARTUP: Type initial lines then run custom commands
  useEffect(() => {
    // Unique ID for the current terminal configuration to handle project switching
    const terminalId = terminal?.title || "default";

    // If this terminal session is already running or already played for this ID, don't restart
    // Unless terminalId is null/undefined (not ready)
    if (!terminal || playheadRef.current === terminalId) return;

    let isMounted = true;
    playheadRef.current = terminalId;

    const startTerminal = async () => {
      // Delay slightly to avoid synchronous setState warnings and let mount settle
      await new Promise(r => setTimeout(r, 200));
      if (!isMounted) return;

      setTerminalLines([]);
      setIsTyping(true);

      // 1. Sequentially type the INITIAL LINES
      const initialLines = Array.isArray(terminal?.lines) ? terminal.lines : [];
      for (const line of initialLines) {
        if (!isMounted) break;
        setTerminalLines(prev => [...prev, { ...line, isAnimated: true }]);
        // Wait for typewriter duration + buffer
        await new Promise(r => setTimeout(r, (line.text.length * 20) + 800));
      }

      if (!isMounted) return;
      await new Promise(r => setTimeout(r, 1200));

      // 2. Sequentially run CUSTOM COMMANDS for demo
      const commands = Array.isArray(terminal?.commands) ? terminal.commands : [];
      for (const cmd of commands) {
        if (!isMounted) break;

        // Removed setTerminalLines([]); to allow lines to show one below another
        updateInputValue("");
        await new Promise(r => setTimeout(r, 400));

        // Simulate real typing speed with randomization
        for (let i = 0; i < cmd.command.length; i++) {
          if (!isMounted) break;
          updateInputValue(cmd.command.slice(0, i + 1));
          await new Promise(r => setTimeout(r, 50 + Math.random() * 50));
        }

        if (!isMounted) break;
        await new Promise(r => setTimeout(r, 800));

        // Execute the command
        handleSubmit(null, cmd.command);
        updateInputValue("");

        // Wait for response animation and pause before next command
        // Estimate output length duration
        const outputDuration = (cmd.output?.length || 0) * 15;
        await new Promise(r => setTimeout(r, outputDuration + 3500));
      }

      if (isMounted) setIsTyping(false);
    };

    startTerminal();

    return () => {
      isMounted = false;
      // Reset playhead on unmount so a fresh mount (like in StrictMode) can restart it
      playheadRef.current = null;
    };
  }, [terminal, handleSubmit]);

  // Scroll to bottom whenever lines change
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const handleTerminalClick = () => {
    if (terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  };

  if (!heading && !subHeading && !myRole?.contribution) return null;

  return (
    <section className="pd-project-overview section-spacing">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title section-title-center">
              <span className="sub-heading-tag-2">
                <div className="sub-heading-image">
                  <picture>
                    <Image src="/images/user-2.svg" alt="Techu Mayur" width={20} height={20} loading="lazy" fetchPriority="high" className="img-fluid" />
                  </picture>
                </div>
                {subHeading}
              </span>
              <h2>{heading}<span className="highlight">{highlightText}</span></h2>
            </div>
          </div>
        </div>
        <div className="row g-5 align-items-stretch" id="portfolio-project-overview">
          <div className="col-lg-7 order-2 order-lg-1">
            <div className="terminal-section">
              <div
                className={`terminal-window ${isLightMode ? 'light-mode' : ''}`}
                id="terminalWindow"
                onClick={handleTerminalClick}
                style={{ cursor: 'text' }}
              >
                <div className="terminal-header">
                  <div className="terminal-buttons">
                    <div className="terminal-btn btn-close-terminal"></div>
                    <div className="terminal-btn btn-minimize"></div>
                    <div className="terminal-btn btn-maximize"></div>
                  </div>
                  <div className="terminal-title">{terminal?.title}</div>
                  <div className="terminal-actions">
                    <button className="terminal-action-btn" onClick={(e) => { e.stopPropagation(); clearTerminal(); }}>Clear</button>
                    <button className="terminal-action-btn" onClick={(e) => { e.stopPropagation(); showHelp(); }}>Help</button>
                    <button
                      className={`mode-toggle ${isLightMode ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleMode(); }}
                      id="modeToggle"
                      title="Toggle Dark/Light Mode"
                    >
                      <div className="mode-toggle-slider">
                        <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ display: isLightMode ? 'block' : 'none' }}>
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
                        <svg id="moonIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ display: !isLightMode ? 'block' : 'none' }}>
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="terminal-body" id="terminalOutput" ref={terminalOutputRef}>
                  {terminalLines.map((line, idx) => (
                    <div key={idx} className={`terminal-line terminal-${line.type}`}>
                      {line.type === 'command' ? (
                        <>
                          <span className="terminal-prompt">➜</span>{" "}
                          <span className="terminal-command">{line.text}</span>
                        </>
                      ) : (
                        line.isAnimated ? (
                          <TypewriterText
                            text={line.text}
                            onComplete={idx === terminalLines.length - 1 ? () => setIsTyping(false) : undefined}
                          />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: parseHtml(line.text) }} />
                        )
                      )}
                    </div>
                  ))}
                  <div className="terminal-line terminal-info">───────────────────────────────────────</div>
                  <form onSubmit={handleSubmit} className="terminal-input-line">
                    <span className="terminal-prompt">➜</span>
                    <input
                      type="text"
                      className="terminal-input"
                      id="terminalInput"
                      ref={terminalInputRef}
                      placeholder={isTyping ? "..." : terminal?.placeholder}
                      autoComplete="off"
                      value={inputValue}
                      onChange={(e) => updateInputValue(e.target.value)}
                      disabled={isTyping}
                      style={{ caretColor: 'var(--primary-color)' }}
                    />
                    <span className="cursor"></span>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5 order-1 order-lg-2">
            <div className="bento-item h-100">
              <div className="bento-stat-card h-100 d-flex flex-column">
                <h2>My <span className="highlight">Role</span></h2>
                <ul className="intel-list">
                  {myRole?.contribution && (
                    <li className="intel-item">
                      <span className="intel-label">Contribution</span>
                      <span className="intel-value">{myRole.contribution}</span>
                    </li>
                  )}
                  {myRole?.technologies && (
                    <li className="intel-item">
                      <span className="intel-label">Technologies</span>
                      <span className="intel-value">{myRole.technologies}</span>
                    </li>
                  )}
                  {myRole?.deliverables && (
                    <li className="intel-item">
                      <span className="intel-label">Deliverables</span>
                      <span className="intel-value">{myRole.deliverables}</span>
                    </li>
                  )}
                </ul>
                <div className="mt-auto pt-4">
                  <a target='_blank' href={liveLink || "#"} className="primary-btn w-100 justify-content-center">
                    <span className="primary-btn-icon">
                      <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                      </svg>
                      <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                      </svg>
                    </span>
                    Live Experience
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
