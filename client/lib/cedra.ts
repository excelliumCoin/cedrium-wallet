// lib/cedra.ts
import { Cedra, Network } from '@cedra-labs/ts-sdk';
import axios from 'axios';

export const cedra = new Cedra({
  network: Network.DEVNET,
  // Geçici çözüm olarak client alanı bypass edilebilir
} as any);



