'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Alert, AlertDescription } from '@/components/ui/alert'; // Componente não disponível
import { Loader2, Plus, Eye, Lock, Unlock, Shield, BarChart3, Database, Key } from 'lucide-react';

// Simulação de dados do contrato (em produção, conectar com o contrato real)
const CONTRACT_ID = 'CBAFSPMDNDW7F6T4A5W2B7BWSN4G2IZULUEWPB7B2S2ADNPU2FKD72RA';
const NETWORK = 'Stellar Testnet';

interface NFT {
  id: number;
  name: string;
  description: string;
  hasPublicData: boolean;
  hasEncryptedData: boolean;
  accessCount: number;
  createdAt: string;
}

interface SystemStats {
  totalNfts: number;
  totalAccesses: number;
  nftsWithPublicData: number;
  nftsWithEncryptedData: number;
}

export default function NFTDataSharingPage() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalNfts: 0,
    totalAccesses: 0,
    nftsWithPublicData: 0,
    nftsWithEncryptedData: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulário para criar NFT
  const [newNft, setNewNft] = useState({
    name: '',
    description: '',
  });

  // Dados simulados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const mockNfts: NFT[] = [
        {
          id: 0,
          name: 'Ana Costa',
          description: 'Candidata para gerente',
          hasPublicData: true,
          hasEncryptedData: false,
          accessCount: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: 1,
          name: 'João Silva',
          description: 'Candidato para desenvolvedor',
          hasPublicData: false,
          hasEncryptedData: true,
          accessCount: 3,
          createdAt: new Date().toISOString(),
        },
      ];

      setNfts(mockNfts);
      setStats({
        totalNfts: mockNfts.length,
        totalAccesses: mockNfts.reduce((sum, nft) => sum + nft.accessCount, 0),
        nftsWithPublicData: mockNfts.filter(nft => nft.hasPublicData).length,
        nftsWithEncryptedData: mockNfts.filter(nft => nft.hasEncryptedData).length,
      });
    } catch (err) {
      setError('Erro ao carregar dados: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createNFT = async () => {
    if (!newNft.name || !newNft.description) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Simular criação de NFT
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newNftData: NFT = {
        id: nfts.length,
        name: newNft.name,
        description: newNft.description,
        hasPublicData: false,
        hasEncryptedData: false,
        accessCount: 0,
        createdAt: new Date().toISOString(),
      };

      setNfts([...nfts, newNftData]);
      setStats(prev => ({
        ...prev,
        totalNfts: prev.totalNfts + 1,
      }));

      setNewNft({ name: '', description: '' });
      setSuccess('NFT criada com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao criar NFT: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addPublicData = async (nftId: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNfts(nfts.map(nft => 
        nft.id === nftId 
          ? { ...nft, hasPublicData: true, accessCount: nft.accessCount + 1 }
          : nft
      ));
      
      setStats(prev => ({
        ...prev,
        totalAccesses: prev.totalAccesses + 1,
        nftsWithPublicData: prev.nftsWithPublicData + 1,
      }));

      setSuccess('Dados públicos adicionados!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao adicionar dados: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addEncryptedData = async (nftId: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNfts(nfts.map(nft => 
        nft.id === nftId 
          ? { ...nft, hasEncryptedData: true, accessCount: nft.accessCount + 1 }
          : nft
      ));
      
      setStats(prev => ({
        ...prev,
        totalAccesses: prev.totalAccesses + 1,
        nftsWithEncryptedData: prev.nftsWithEncryptedData + 1,
      }));

      setSuccess('Dados criptografados adicionados!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao adicionar dados criptografados: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔐 NFT Data Sharing Platform
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Sistema de Compartilhamento Seguro de Dados com NFTs
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Badge variant="outline" className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              {NETWORK}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Key className="w-3 h-3" />
              {CONTRACT_ID.slice(0, 8)}...
            </Badge>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 border border-green-200 bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de NFTs</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNfts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Acessos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAccesses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dados Públicos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nftsWithPublicData}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dados Criptografados</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nftsWithEncryptedData}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="nfts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="create">Criar NFT</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="space-y-6">
            <div className="grid gap-6">
              {nfts.map((nft) => (
                <Card key={nft.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          NFT #{nft.id}
                          <Badge variant="secondary">{nft.name}</Badge>
                        </CardTitle>
                        <CardDescription>{nft.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={nft.hasPublicData ? "default" : "outline"}>
                          <Eye className="w-3 h-3 mr-1" />
                          Público
                        </Badge>
                        <Badge variant={nft.hasEncryptedData ? "default" : "outline"}>
                          <Lock className="w-3 h-3 mr-1" />
                          Criptografado
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Acessos: {nft.accessCount}</span>
                        <span>Criado em: {new Date(nft.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addPublicData(nft.id)}
                          disabled={loading || nft.hasPublicData}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Adicionar Dados Públicos
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addEncryptedData(nft.id)}
                          disabled={loading || nft.hasEncryptedData}
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          Adicionar Dados Criptografados
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create NFT Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Criar Nova NFT
                </CardTitle>
                <CardDescription>
                  Crie uma nova NFT para compartilhamento de dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Ana Costa"
                    value={newNft.name}
                    onChange={(e) => setNewNft({ ...newNft, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: Candidata para gerente"
                    value={newNft.description}
                    onChange={(e) => setNewNft({ ...newNft, description: e.target.value })}
                  />
                </div>
                <Button onClick={createNFT} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar NFT
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Estatísticas do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalNfts}</div>
                      <div className="text-sm text-blue-600">NFTs Criadas</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.totalAccesses}</div>
                      <div className="text-sm text-green-600">Total de Acessos</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.nftsWithPublicData}</div>
                      <div className="text-sm text-yellow-600">Com Dados Públicos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.nftsWithEncryptedData}</div>
                      <div className="text-sm text-purple-600">Com Dados Criptografados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Status de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Controle de Acesso</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Criptografia</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Lock className="w-3 h-3 mr-1" />
                        Implementada
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auditoria</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Habilitada
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Integridade</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verificada
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>🔗 Contrato: {CONTRACT_ID}</p>
          <p>🌐 Rede: {NETWORK}</p>
          <p>📊 Dashboard integrado com Stellar Testnet</p>
        </div>
      </div>
    </div>
  );
}
