/* eslint-disable @typescript-eslint/naming-convention */
const folderNames: {
  [key: string]: string;
} = {
  admin: "admin",
  android: "android",
  ".angular": "angular",
  animation: "animation",
  animations: "animation",
  animated: "animation",
  ansible: "ansible",
  inventories: "ansible",
  inventory: "ansible",
  playbooks: "ansible",
  collections: "ansible",
  ansible_collections: "ansible",
  roles: "ansible",
  api: "api",
  ".api": "api",
  apollo: "apollo",
  "apollo-client": "apollo",
  "apollo-cache": "apollo",
  "apollo-config": "apollo",
  app: "app",
  ".app": "app",
  archive: "archive",
  archives: "archive",
  archival: "archive",
  backup: "archive",
  backups: "archive",
  "back-up": "archive",
  "back-ups": "archive",
  assets: "asset",
  ".assets": "asset",
  resource: "asset",
  resources: "asset",
  audio: "audio",
  ".audio": "audio",
  audios: "audio",
  ".audios": "audio",
  sound: "audio",
  ".sound": "audio",
  sounds: "audio",
  ".sounds": "audio",
  aurelia_project: "aurelia",
  aws: "aws",
  ".aws": "aws",
  ".azure-pipelines": "azure_pipelines",
  ".azure-pipelines-ci": "azure_pipelines",
  base: "base",
  ".base": "base",
  batch: "batch",
  batchs: "batch",
  batches: "batch",
  benchmark: "benchmark",
  benchmarks: "benchmark",
  performance: "benchmark",
  measure: "benchmark",
  measures: "benchmark",
  measurement: "benchmark",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  bower_components: "bower",
  cart: "cart",
  "shopping-cart": "cart",
  shopping: "cart",
  shop: "cart",
  ".changesets": "_f_changesets",
  ci: "ci",
  ".ci": "ci",
  ".circleci": "circleci",
  client: "client",
  clients: "client",
  frontend: "client",
  pwa: "client",
  cluster: "cluster",
  clusters: "cluster",
  cobol: "cobol",
  cli: "command",
  cmd: "command",
  command: "command",
  commands: "command",
  commandline: "command",
  components: "component",
  widget: "component",
  widgets: "component",
  conf: "config",
  ".conf": "config",
  config: "config",
  ".config": "config",
  configs: "config",
  ".configs": "config",
  configuration: "config",
  ".configuration": "config",
  configurations: "config",
  ".configurations": "config",
  setting: "config",
  ".setting": "config",
  settings: "config",
  ".settings": "config",
  "META-INF": "config",
  connection: "connection",
  connections: "connection",
  constant: "constant",
  constants: "constant",
  container: "container",
  containers: "container",
  ".devcontainer": "container",
  content: "content",
  contents: "content",
  feature: "content",
  features: "content",
  context: "context",
  contexts: "context",
  store: "pinia_store",
  stores: "pinia_store",
  contract: "contract",
  contracts: "contract",
  ".contract": "contract",
  "contract-testing": "contract",
  "contract-test": "contract",
  "contract-tests": "contract",
  pact: "contract",
  pacts: "contract",
  controller: "controller",
  controllers: "controller",
  service: "controller",
  services: "controller",
  provider: "controller",
  providers: "controller",
  reducer: "controller",
  reducers: "controller",
  core: "core",
  coverage: "coverage",
  ".nyc-output": "coverage",
  e2e: "coverage",
  it: "coverage",
  "integration-test": "coverage",
  "integration-tests": "coverage",
  css: "css",
  _css: "css",
  style: "css",
  styles: "css",
  stylesheets: "css",
  stylesheet: "css",
  custom: "custom",
  customs: "custom",
  ".cypress": "cypress",
  cypress: "cypress",
  db: "database",
  database: "database",
  sql: "database",
  data: "database",
  debug: "debug",
  debugging: "debug",
  decorator: "decorators",
  decorators: "decorators",
  delta: "delta",
  deltas: "delta",
  changes: "delta",
  dist: "dist",
  ".dist": "dist",
  dists: "dist",
  out: "dist",
  outs: "dist",
  build: "dist",
  ".build": "dist",
  builds: "dist",
  release: "dist",
  releases: "dist",
  bin: "dist",
  docker: "docker",
  ".docker": "docker",
  docs: "docs",
  doc: "docs",
  download: "download",
  downloads: "download",
  dump: "dump",
  dumps: "dump",
  directives: "directives",
  ".directives": "directives",
  elixir: "elixir",
  ".elixir_ls": "elixir",
  ".env": "environment",
  ".environment": "environment",
  env: "environment",
  envs: "environment",
  environment: "environment",
  environments: "environment",
  error: "error",
  errors: "error",
  err: "error",
  exception: "error",
  exceptions: "error",
  notification: "event",
  notifications: "event",
  event: "event",
  events: "event",
  demo: "examples",
  demos: "examples",
  example: "examples",
  examples: "examples",
  sample: "examples",
  samples: "examples",
  "sample-data": "examples",
  ".expo": "expo",
  ".expo-shared": "expo",
  export: "export",
  exports: "export",
  fastlane: "fastlane",
  ".firebase": "firebase",
  flow: "flow",
  "flow-typed": "flow",
  fonts: "fonts",
  font: "fonts",
  fnt: "fonts",
  function: "functions",
  functions: "functions",
  lambda: "functions",
  lambdas: "functions",
  logic: "functions",
  math: "functions",
  calc: "functions",
  calculation: "functions",
  calculations: "functions",
  rpc: "functions",
  rpcs: "functions",
  generator: "generator",
  generators: "generator",
  generated: "generator",
  "cfn-gen": "generator",
  gen: "generator",
  gens: "generator",
  auto: "generator",
  ".git": "git",
  git: "git",
  patches: "git",
  githooks: "git",
  ".githooks": "git",
  submodules: "git",
  ".submodules": "git",
  ".github": "github",
  ".gitlab": "gitlab",
  global: "global",
  gradle: "gradle",
  ".gradle": "gradle",
  graphql: "graphql",
  gql: "graphql",
  guard: "guard",
  guards: "guard",
  gulp: "gulp",
  helper: "helper",
  ".helper": "helper",
  helpers: "helper",
  ".helpers": "helper",
  home: "home",
  ".home": "home",
  start: "home",
  ".start": "home",
  hook: "hook",
  hooks: "hook",
  trigger: "hook",
  triggers: "hook",
  husky: "husky",
  ".husky": "husky",
  lang: "i18n",
  language: "i18n",
  languages: "i18n",
  locale: "i18n",
  locales: "i18n",
  _locale: "i18n",
  _locales: "i18n",
  internationalization: "i18n",
  globalization: "i18n",
  localization: "i18n",
  i18n: "i18n",
  g11n: "i18n",
  l10n: "i18n",
  images: "images",
  image: "images",
  imgs: "images",
  img: "images",
  icons: "images",
  icon: "images",
  icos: "images",
  ico: "images",
  figures: "images",
  figure: "images",
  figs: "images",
  fig: "images",
  screenshot: "images",
  screenshots: "images",
  screengrab: "images",
  screengrabs: "images",
  pic: "images",
  pics: "images",
  picture: "images",
  pictures: "images",
  import: "import",
  imports: "import",
  imported: "import",
  include: "include",
  includes: "include",
  incl: "include",
  inc: "include",
  ".include": "include",
  ".includes": "include",
  ".incl": "include",
  ".inc": "include",
  _include: "include",
  _includes: "include",
  _incl: "include",
  _inc: "include",
  ".idea": "intellij",
  interface: "interface",
  interfaces: "interface",
  ios: "ios",
  js: "javascript",
  javascript: "javascript",
  javascripts: "javascript",
  jinja: "jinja",
  jinja2: "jinja",
  j2: "jinja",
  job: "job",
  jobs: "job",
  json: "json",
  jsons: "json",
  jwt: "jwt",
  key: "keys",
  keys: "keys",
  token: "keys",
  tokens: "keys",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  kube: "kubernetes",
  kuber: "kubernetes",
  ".kubernetes": "kubernetes",
  ".k8s": "kubernetes",
  ".kube": "kubernetes",
  ".kuber": "kubernetes",
  layout: "layout",
  layouts: "layout",
  lottie: "lottie",
  lotties: "lottie",
  lottiefiles: "lottie",
  less: "less",
  _less: "less",
  lib: "library",
  libs: "library",
  ".lib": "library",
  ".libs": "library",
  library: "library",
  libraries: "library",
  vendor: "library",
  log: "log",
  dmp: "log",
  logs: "log",
  lua: "lua",
  mail: "mail",
  mails: "mail",
  email: "mail",
  emails: "mail",
  smtp: "mail",
  mailers: "mail",
  mapping: "mappings",
  mappings: "mappings",
  markdown: "markdown",
  md: "markdown",
  messages: "messages",
  messaging: "messages",
  forum: "messages",
  chat: "messages",
  chats: "messages",
  conversation: "messages",
  conversations: "messages",
  meta: "meta",
  middleware: "middleware",
  middlewares: "middleware",
  migration: "migration",
  migrations: "migration",
  mjml: "mjml",
  ".mjml": "mjml",
  mobile: "mobile",
  mobiles: "mobile",
  portable: "mobile",
  portability: "mobile",
  mock: "mock",
  mocks: "mock",
  draft: "mock",
  drafts: "mock",
  concept: "mock",
  concepts: "mock",
  sketch: "mock",
  sketches: "mock",
  modal: "modal",
  modals: "modal",
  model: "model",
  models: "model",
  schemas: "model",
  schema: "model",
  class: "model",
  classes: "model",
  ".moon": "moon",
  ".next": "next",
  "cmake": "cmake",
  node_modules: "node",
  ".nuxt": "nuxt",
  nuxt: "nuxt",
  other: "other",
  others: "other",
  misc: "other",
  miscellaneous: "other",
  extra: "other",
  extras: "other",
  package: "package",
  packages: "package",
  pkg: "package",
  pkgs: "package",
  php: "php",
  phpmailer: "phpmailer",
  pipe: "pipe",
  pipes: "pipe",
  playwright: "playwright",
  pw: "playwright",
  extension: "plugin",
  extensions: "plugin",
  addon: "plugin",
  addons: "plugin",
  module: "plugin",
  modules: "plugin",
  plugin: "plugin",
  plugins: "plugin",
  _plugins: "plugin",
  prisma: "prisma",
  private: "private",
  ".private": "private",
  project: "project",
  projects: "project",
  ".project": "project",
  ".projects": "project",
  public: "public",
  ".public": "public",
  www: "public",
  wwwroot: "public",
  web: "public",
  website: "public",
  python: "python",
  __pycache__: "python",
  ".pytest_cache": "python",
  ".quasar": "quasar",
  query: "query",
  queries: "query",
  queue: "queue",
  queues: "queue",
  bull: "queue",
  mq: "queue",
  ".s2i": "red_hat",
  s2i: "red_hat",
  repository: "repository",
  repositories: "repository",
  review: "review",
  reviews: "review",
  revisal: "review",
  revisals: "review",
  reviewed: "review",
  routers: "route",
  router: "route",
  routes: "route",
  rule: "rules",
  rules: "rules",
  validation: "rules",
  validations: "rules",
  validator: "rules",
  validators: "rules",
  bot: "robot",
  ".bot": "robot",
  robot: "robot",
  ".robot": "robot",
  _robot: "robot",
  _bot: "robot",
  ".cargo": "rust",
  sass: "sass",
  scss: "sass",
  _sass: "sass",
  _scss: "sass",
  scala: "scala",
  script: "script",
  scripts: "script",
  certificates: "secure",
  certificate: "secure",
  cert: "secure",
  certs: "secure",
  auth: "secure",
  authentication: "secure",
  secure: "secure",
  security: "secure",
  ssl: "secure",
  server: "server",
  servers: "server",
  backend: "server",
  serverless: "serverless",
  ".serverless": "serverless",
  shared: "shared",
  common: "shared",
  src: "src",
  source: "src",
  sources: "src",
  stack: "stack",
  stacks: "stack",
  ".stencil": "stencil",
  storage: "storage",
  ".storage": "storage",
  ".storybook": "storybook",
  storybook: "storybook",
  stories: "storybook",
  __stories__: "storybook",
  stylus: "stylus",
  sublime: "sublime",
  svelte: "svelte",
  svg: "svg",
  svgs: "svg",
  syntax: "syntax",
  syntaxes: "syntax",
  spellcheck: "syntax",
  tasks: "tasks",
  tickets: "tasks",
  "src-tauri": "tauri",
  temp: "temp",
  ".temp": "temp",
  tmp: "temp",
  ".tmp": "temp",
  cached: "temp",
  cache: "temp",
  ".cache": "temp",
  template: "template",
  templates: "template",
  terraform: "terraform",
  ".terraform": "terraform",
  tests: "test",
  test: "test",
  testing: "test",
  __tests__: "test",
  __test__: "test",
  __snapshots__: "test",
  __mocks__: "test",
  spec: "test",
  specs: "test",
  theme: "theme",
  themes: "theme",
  color: "theme",
  colors: "theme",
  design: "theme",
  designs: "theme",
  tools: "tools",
  typescript: "typescript",
  ts: "typescript",
  typings: "typescript",
  types: "typescript",
  type: "typescript",
  "@types": "typescript",
  update: "update",
  updates: "update",
  upgrade: "update",
  upgrades: "update",
  upload: "upload",
  uploads: "upload",
  util: "utils",
  utils: "utils",
  utility: "utils",
  utilities: "utils",
  video: "video",
  videos: "video",
  Movie: "video",
  Movies: "video",
  html: "view",
  view: "view",
  views: "view",
  page: "view",
  pages: "view",
  screen: "view",
  screens: "view",
  vm: "vm",
  vms: "vm",
  ".vscode": "vscode",
  ".vscode-test": "vscode_test",
  ".vuepress": "vuepress",
  wakatime: "wakatime",
  webpack: "webpack",
  ".webpack": "webpack",
  "wp-content": "wordpress",
  ".wordpress-org": "wordpress",
};

export default folderNames;