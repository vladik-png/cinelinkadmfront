export interface SavedNode {
    host: string;
    user: string;
    pass: string;
    remoteDir: string;
}

export interface TerminalSession {
    id: string;
    node: SavedNode;
}