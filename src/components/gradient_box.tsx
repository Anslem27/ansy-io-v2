
export const GradientBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div
            className="p-3 relative"
            style={{
                borderLeft: '1px solid transparent',
                borderBottom: '1px solid transparent',
                borderImage: 'radial-gradient(circle at bottom left, #fbd38d, #aa98a9, transparent 70%) 1',
            }}
        >
            {children}
        </div>
    );
};
