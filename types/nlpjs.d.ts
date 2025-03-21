// types/nlp.d.ts

declare module '@nlpjs/core' {
  export class Container {
    use(plugin: any): void;
    register(name: string, Class: any, singleton?: boolean): void;
    get<T>(name: string): T;
  }
}

declare module '@nlpjs/nlp' {
  import { Container } from '@nlpjs/core';
  import { NluManager } from '@nlpjs/nlu';
  import { NerManager } from '@nlpjs/ner';

  export class Nlp {
    constructor(settings?: {
      container?: Container;
      locales?: string[];
      nlu?: NluManager;
      ner?: NerManager;
      [key: string]: any;
    });

    addLanguage(locales: string | string[]): void;
    addDocument(locale: string, utterance: string, intent: string): void;
    addAnswer(locale: string, intent: string, answer: string): void;
    train(): Promise<void>;
    process(
      locale: string,
      utterance: string,
      context?: any
    ): Promise<{
      locale: string;
      utterance: string;
      languageGuessed: boolean;
      localeIso2: string;
      language: string;
      nluAnswer: any;
      classifications: { intent: string; score: number }[];
      intent: string;
      score: number;
      domain: string;
      entities: any[];
      answers: { answer: string; score: number }[];
      answer: string;
      actions: any[];
      sentiment: any;
    }>;
    load(filePath: string): Promise<void>;
    save(filePath: string): Promise<void>;

    export(): string;
    import(modelJson: string): void;

    settings: {
      autoSave?: boolean;
      modelFileName?: string;
      [key: string]: any;
    };
  }
}

declare module '@nlpjs/ner' {
  import { Container } from '@nlpjs/core';

  export class Ner {
    constructor(settings?: { container?: Container; [key: string]: any });

    addNamedEntityText(
      entityName: string,
      optionName: string,
      languages: string[],
      texts: string[]
    ): void;

    addRegexEntity(
      entityName: string,
      languages: string[],
      regex: RegExp
    ): void;

    findEntities(
      utterance: string,
      locale: string
    ): Promise<{
      start: number;
      end: number;
      len: number;
      accuracy: number;
      sourceText: string;
      utteranceText: string;
      entity: string;
      resolution: any;
    }[]>;
  }
}

declare module '@nlpjs/lang-es' {
  import { Container } from '@nlpjs/core';

  const LangEs: {
    register(container: Container): void;
  };

  export default LangEs;
}
