/**
 * config.js — Constantes globais compartilhadas da aplicação Moneo.
 *
 * Centraliza valores de configuração para eliminar a repetição de strings
 * hardcoded entre módulos (princípio DRY) e facilitar mudanças de ambiente.
 * Qualquer alteração de URL ou valor padrão precisa ser feita em um único lugar.
 */

/** URL base do servidor JSON Server */
const BASE_URL = "http://localhost:3000";

/** Imagem de placeholder exibida enquanto o avatar do usuário não está disponível */
const PLACEHOLDER_IMAGEM_USUARIO = "https://via.placeholder.com/100";

/** Caminho relativo da página de login — usado por todos os módulos que redirecionam */
const PAGINA_LOGIN = "/modulos/login/login.html";
