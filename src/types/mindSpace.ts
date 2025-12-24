export interface EncryptedThought {
  encrypted: boolean;
  data: string;
}

export interface Thought {
  _id: string;
  title: string;
  desc: string;
  occurredAt: string;
  createdAt: string;
  lastModified: string;
  readsAt: string[];
  tags: string[];
}
