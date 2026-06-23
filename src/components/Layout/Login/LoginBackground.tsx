import * as React from 'react';

export const LoginBackground: React.FC = () => {
    return (
        <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3699ff]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1bc5bd]/5 rounded-full blur-[100px] pointer-events-none"></div>
        </>
    );
};
