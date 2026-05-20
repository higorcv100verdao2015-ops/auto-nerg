import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  MessageCircle,
  ShieldCheck,
  Wrench,
  Zap
} from 'lucide-react';
import logoImage from '../../assets/web/auto-nerg-logo.jpeg';
import painelImage from '../../assets/web/portfolio-painel-01.jpg';
import bombasImage from '../../assets/web/portfolio-bombas-01.jpg';
import medicaoImage from '../../assets/web/portfolio-medicao-01.jpg';
import bombasFinalImage from '../../assets/web/portfolio-bombas-02.jpg';
import comandoImage from '../../assets/web/portfolio-comando-01.jpeg';
import { Button } from '../components/Button';

interface PublicHomeProps {
  onAdminAccess: () => void;
}

const whatsappUrl = 'https://wa.me/5565999999999?text=Ola%2C%20vim%20pelo%20site%20da%20Auto%26Nerg%20e%20quero%20solicitar%20um%20atendimento.';

const services = [
  {
    title: 'Comandos eletricos',
    description: 'Montagem, organizacao e manutencao de paineis para motores, bombas e sistemas industriais.',
    icon: Zap
  },
  {
    title: 'Eletrotecnica predial',
    description: 'Instalacoes, adequacoes, identificacao de falhas e melhorias em infraestrutura eletrica.',
    icon: Wrench
  },
  {
    title: 'Testes e medicoes',
    description: 'Verificacao de corrente, protecoes, comandos e funcionamento dos equipamentos em campo.',
    icon: Gauge
  }
];

const portfolio = [
  { src: painelImage, title: 'Painel de comando', description: 'Montagem organizada com protecoes e comandos dedicados.' },
  { src: bombasImage, title: 'Sistema de bombas', description: 'Automacao e acionamento para conjunto motobomba.' },
  { src: medicaoImage, title: 'Medicao em campo', description: 'Inspecao com alicate amperimetro e verificacao de carga.' },
  { src: bombasFinalImage, title: 'Entrega tecnica', description: 'Painel fechado e sistema em funcionamento.' },
  { src: comandoImage, title: 'Painel industrial', description: 'Manutencao e ajustes em painel de automacao.' }
];

export function PublicHome({ onAdminAccess }: PublicHomeProps) {
  return (
    <div className="bg-white text-gray-900">
      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[#061527] text-white">
        <img
          src={painelImage}
          alt="Painel eletrico montado pela Auto&Nerg"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061527] via-[#061527]/85 to-[#061527]/35" />

        <div className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl flex-col justify-center px-4 py-16 md:px-8">
          <div className="max-w-3xl">
            <img
              src={logoImage}
              alt="Auto&Nerg Eletrotecnica"
              className="mb-8 h-28 w-28 rounded-2xl object-cover shadow-2xl md:h-36 md:w-36"
            />
            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Auto&Nerg Eletrotecnica
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-50 md:text-2xl">
              Inovacao e solucoes em energia para instalacoes, comandos eletricos, manutencao e sistemas de bombeamento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <Button size="lg">
                  <MessageCircle size={20} />
                  Solicitar atendimento
                </Button>
              </a>
              <Button size="lg" variant="outline" onClick={onAdminAccess}>
                <ShieldCheck size={20} />
                Area admin
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fafc] px-4 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article key={service.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 inline-flex rounded-lg bg-[#FFD700] p-3 text-black">
                  <Icon size={26} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{service.title}</h2>
                <p className="mt-3 text-gray-600">{service.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#0b6f9f]">Trabalhos realizados</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">Servicos com acabamento tecnico e seguranca</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClipboardCheck size={18} className="text-green-600" />
              Atendimento para residencias, comercios e industria
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="aspect-[3/4] bg-gray-100">
                  <img src={item.src} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#061527] px-4 py-16 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#FFD700]">Por que escolher</p>
            <h2 className="mt-2 text-3xl font-bold">Atendimento direto, organizado e com foco em solucao</h2>
            <p className="mt-4 text-blue-50">
              Da avaliacao ao funcionamento final, cada servico e tratado com criterio tecnico, limpeza na montagem e comunicacao clara.
            </p>
          </div>
          <div className="space-y-4">
            {['Diagnostico em campo', 'Montagem de paineis', 'Manutencao preventiva', 'Suporte para orcamentos'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="text-[#FFD700]" size={22} />
                <span>{item}</span>
              </div>
            ))}
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex pt-4">
              <Button>
                Falar pelo WhatsApp
                <ArrowRight size={18} />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
