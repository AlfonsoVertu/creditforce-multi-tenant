import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Componente per il rendering sicuro della documentazione.
 * Supporta tabelle, liste e stili tipografici.
 */
export const MarkdownViewer = ({ content }) => {
    if (!content) return <div className="text-gray-500">Nessuna documentazione disponibile.</div>;

    return (
        <div className="prose prose-blue max-w-none p-6 bg-white shadow rounded-lg">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 border-b pb-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
                    table: ({ node, ...props }) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200" {...props} /></div>,
                    th: ({ node, ...props }) => <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
                    td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-t" {...props} />,
                    code: ({ node, inline, className, children, ...props }) => {
                        return !inline ? (
                            <pre className="bg-gray-800 text-white p-4 rounded mt-2 overflow-x-auto">
                                <code {...props}>{children}</code>
                            </pre>
                        ) : (
                            <code className="bg-gray-100 text-red-500 px-1 rounded" {...props}>{children}</code>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
