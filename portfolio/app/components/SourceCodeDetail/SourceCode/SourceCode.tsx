"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import JSZip from 'jszip';
import { ACFImage } from '@/types/acf';
import './SourceCode.css';

interface SourceCodeData {
    sub_heading?: string;
    sub_heading_icon?: ACFImage;
    heading?: string;
    highlight_text?: string;
    description?: string;
    download_zip: string;
    github_url: string;
    // Editor fields
    entry_file_name?: string;
    entry_file_content?: string;
    readme_content?: string;
    editor_height?: string;
    stackblitz_template?: 'javascript' | 'typescript' | 'angular-cli' | 'create-react-app' | 'vue-cli' | 'node';
}

interface SourceCodeProps {
    data?: SourceCodeData;
    title?: string;
}

const SourceCode: React.FC<SourceCodeProps> = ({ data, title = "Project" }) => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionStatus, setExtractionStatus] = useState<string>('');

    const getImageUrl = (image?: ACFImage): string | undefined => {
        if (!image) return undefined;
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && 'url' in image) return image.url;
        return undefined;
    };

    const initStackBlitz = useCallback(async () => {
        // @ts-expect-error StackBlitzSDK is loaded via script tag
        if (typeof StackBlitzSDK === 'undefined') return;

        
        const zipUrl = getImageUrl(data?.download_zip);
        const fileName = data?.entry_file_name || 'index.js';
        let projectFiles: Record<string, string> = {
            'README.md': data?.readme_content || `# ${title}\n\nExplore the architecture in browser or download the full source code using the buttons above.`
        };

        

        if (zipUrl) {
            try {
                setIsExtracting(true);
                setExtractionStatus('Fetching ZIP archive...');

                
                const response = await fetch(`/api/proxy-zip?url=${encodeURIComponent(zipUrl)}`);

                if (!response.ok) {
                    throw new Error(`Proxy Fetch Error! status: ${response.status}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                

                setExtractionStatus('Extracting project files...');
                const zip = await JSZip.loadAsync(arrayBuffer);
                const extractedFiles: Record<string, string> = {};

                // Get all file paths (ignoring directories)
                const allFilePaths = Object.keys(zip.files).filter(path => !zip.files[path].dir);
                

                // System/hidden/heavy files to ignore
                const skipList = ['__MACOSX', '.DS_Store', 'node_modules', 'dist', 'build', 'vendor', '.git'];

                let totalSize = 0;
                const SIZE_LIMIT = 2 * 1024 * 1024; // 2MB total limit (StackBlitz SDK safe zone)

                // Detect common root folder (e.g., "GSAP-master/")
                let commonPrefix = "";
                if (allFilePaths.length > 0) {
                    const firstPath = allFilePaths[0];
                    const firstSlashIndex = firstPath.indexOf('/');
                    if (firstSlashIndex !== -1) {
                        const potentialPrefix = firstPath.substring(0, firstSlashIndex + 1);
                        const allSharePrefix = allFilePaths.every(path => path.startsWith(potentialPrefix));
                        if (allSharePrefix) {
                            commonPrefix = potentialPrefix;
                            
                        }
                    }
                }

                await Promise.all(
                    allFilePaths.map(async (filePath) => {
                        // 1. Skip if in skipList
                        if (skipList.some(skip => filePath.includes(skip))) return;

                        // 2. Filter for text-based files locally (safety check)
                        const textExtensions = [
                            '.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss',
                            '.html', '.php', '.md', '.txt', '.py', '.svg', '.env',
                            '.gitignore', '.xml', '.yml', '.yaml'
                        ];
                        const isText = textExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
                        if (!isText) return;

                        const file = zip.files[filePath];
                        try {
                            const content = await file.async('string');

                            // 3. Check cumulative size limit
                            if (totalSize + content.length > SIZE_LIMIT) {
                                console.warn(`[StackBlitz Debug] Size limit reached. Skipping remaining files. Current size: ${totalSize}`);
                                return;
                            }

                            // 4. Strip root prefix if it exists
                            const cleanPath = commonPrefix ? filePath.substring(commonPrefix.length) : filePath;
                            extractedFiles[cleanPath] = content;
                            totalSize += content.length;
                        } catch (e) {
                            console.warn(`[StackBlitz Debug] Could not read file: ${filePath}`, e);
                        }
                    })
                );

                const extractedCount = Object.keys(extractedFiles).length;
                

                if (extractedCount > 0) {
                    console.log("[StackBlitz Debug] Extracted files sample:", Object.keys(extractedFiles).slice(0, 10));
                    projectFiles = { ...projectFiles, ...extractedFiles };
                } else {
                    throw new Error("No files were successfully extracted from the ZIP.");
                }
            } catch (error) {
                console.error("[StackBlitz Debug] ZIP Process Error:", error);
                setExtractionStatus(`Error: ${error instanceof Error ? error.message : 'ZIP Processing Failed'}`);

                // Fallback to manual entry
                if (data?.entry_file_content) {
                    projectFiles[fileName] = data.entry_file_content;
                }
            } finally {
                setIsExtracting(false);
            }
        } else if (data?.entry_file_content) {
            
            projectFiles[fileName] = data.entry_file_content;
        }

        // Ensure we have the basic files StackBlitz needs for the preview
        const template = data?.stackblitz_template || 'javascript';
        
        // 1. Inject index.html if missing (crucial for JS/TS templates)
        if (['javascript', 'typescript'].includes(template) && !projectFiles['index.html']) {
            
            projectFiles['index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
</head>
<body>
    <div id="root"></div>
    <div id="app"></div>
</body>
</html>`;
        }

        // 2. Map entry file to index.js if missing
        if (!projectFiles['index.js'] && !projectFiles['index.ts']) {
            const potentialEntry = Object.keys(projectFiles).find(f => f === fileName || f.endsWith(fileName));
            if (potentialEntry) {
                
                projectFiles['index.js'] = projectFiles[potentialEntry];
            }
        }

        const project = {
            files: projectFiles,
            title: `${title} - Premium Portfolio`,
            description: 'Source code preview.',
            template: template,
        };

        // Determine the best entry file to open in the editor tab
        let fileToOpen = fileName;
        if (!(fileToOpen in projectFiles)) {
            const alternative = Object.keys(projectFiles).find(k => k.endsWith(fileName));
            fileToOpen = alternative || Object.keys(projectFiles).find(k => k.toLowerCase().includes('index')) || Object.keys(projectFiles)[0];
            
        }

        
        // @ts-expect-error StackBlitzSDK is loaded via script tag
        StackBlitzSDK.embedProject('stackblitz-editor', project, {
            openFile: fileToOpen,
            theme: theme,
            width: '100%',
            height: parseInt(data?.editor_height || '500'),
            view: 'both',
            showSidebar: true
        });
    }, [data, theme, title]);

    const openFullEditor = () => {
        // @ts-expect-error StackBlitzSDK is loaded via script tag
        if (typeof StackBlitzSDK === 'undefined') return;

        // Re-construct the project object for the full editor
        const fileName = data?.entry_file_name || 'index.js';
        const project = {
            files: {
                'README.md': data?.readme_content || `# ${title}\n\nFull source code repository.`,
                // We'd ideally want to pass all projectFiles here, but since projectFiles is local to initStackBlitz,
                // we'd need to lift it to state if we wanted the full ZIP content.
                // For now, we'll open the main entry points.
                [fileName]: data?.entry_file_content || '// Explore the full archive'
            },
            title: `${title} - Full Workspace`,
            template: data?.stackblitz_template || 'javascript',
        };

        // @ts-expect-error StackBlitzSDK is loaded via script tag
        StackBlitzSDK.openProject(project, { newWindow: true });
    };

    useEffect(() => {
        initStackBlitz();
    }, [initStackBlitz]);

    return (
        <section id="sc-source-code" className="section-spacing overflow-hidden">
            <Script
                src="https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js"
                onLoad={initStackBlitz}
            />
            <div className="container">
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="section-title">
                            <span className="sub-heading-tag-2 justify-content-center mx-auto mb-3">
                                <div className="sub-heading-image">
                                    {(typeof data?.sub_heading_icon === 'string' && data.sub_heading_icon.trim().startsWith('<svg')) ? (
                                        <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: data.sub_heading_icon }} />
                                    ) : (
                                        <picture>
                                            <img
                                                src={getImageUrl(data?.sub_heading_icon) || "/images/home/brand-strategy.svg"}
                                                alt="Icon"
                                                width="14"
                                                height="14"
                                                className="img-fluid"
                                            />
                                        </picture>
                                    )}
                                </div>
                                {data?.sub_heading || "REPOSITORY"}
                            </span>
                            <h2>
                                {data?.heading || "Get the"}{" "}
                                <span className="highlight">{data?.highlight_text || "Source Code"}</span>
                            </h2>
                            <div className="mt-4 text-muted" dangerouslySetInnerHTML={{ __html: data?.description || "Download the full project archive or explore the repository on GitHub." }} />

                            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                                {data?.download_zip && (
                                    <a
                                        href={getImageUrl(data.download_zip)}
                                        className="sc-btn sc-btn-primary"
                                        download
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        <span>Download ZIP (All Files)</span>
                                    </a>
                                )}
                                {data?.github_url && (
                                    <a
                                        href={data.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sc-btn sc-btn-secondary"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                        <span>View on GitHub</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center mt-5">
                    <div className="col-lg-12">
                        <div className={`vscode-wrapper ${theme}-theme`} id="vscodeEditor">
                            <div className="vscode-titlebar">
                                <div className="window-controls">
                                    <div className="control-btn control-red"></div>
                                    <div className="control-btn control-yellow"></div>
                                    <div className="control-btn control-green"></div>
                                </div>
                                <div className="vscode-title">{title} - Preview</div>
                                <div className="vscode-actions">
                                    <button onClick={openFullEditor} className="vscode-action-btn" title="Open Full Editor">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                        <span>Full Editor</span>
                                    </button>
                                    <div className="vscode-action-divider"></div>
                                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                                        {theme === 'dark' ? '💡' : '🌙'}
                                    </button>
                                </div>
                            </div>
                            <div className="vscode-body">
                                <div id="stackblitz-editor" style={{ width: '100%', height: data?.editor_height ? `${data.editor_height}px` : '500px', border: 'none', background: '#1e1e1e' }}>
                                    {isExtracting ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white gap-3 p-4 text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <div className="extraction-status">
                                                <h5 className="mb-2">Booting IDE Environment</h5>
                                                <p className="text-muted small mb-0">{extractionStatus}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                            <p>Preparing IDE Environment...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SourceCode;
