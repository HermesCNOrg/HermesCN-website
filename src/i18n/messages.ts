import { defaultLocale, type Locale } from "./config";
import messagesJson from "./messages.json";

type Primitive = string | number | boolean | null;
type MessageTree = {
  [key: string]: Primitive | MessageTree;
};

type JoinPath<Prefix extends string, Key extends string> = Prefix extends ""
  ? Key
  : `${Prefix}.${Key}`;

type StringPaths<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: StringPaths<T[K], JoinPath<Prefix, K>>;
      }[Extract<keyof T, string>]
    : never;

type ValuePaths<T, Prefix extends string = ""> = T extends object
  ? | Prefix
    | {
        [K in Extract<keyof T, string>]: ValuePaths<T[K], JoinPath<Prefix, K>>;
      }[Extract<keyof T, string>]
  : Prefix;

const messages = messagesJson satisfies Record<Locale, MessageTree>;

type DefaultMessages = (typeof messages)[typeof defaultLocale];

export type MessageKey = StringPaths<DefaultMessages>;
export type MessageValueKey = ValuePaths<DefaultMessages>;
export type Translator = (
  key: MessageKey,
  params?: Record<string, string | number>,
) => string;

function readPath(source: MessageTree, path: string) {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

function interpolate(value: string, params?: Record<string, string | number>) {
  if (!params) {
    return value;
  }

  return Object.entries(params).reduce(
    (text, [key, replacement]) =>
      text.replaceAll(`{${key}}`, String(replacement)),
    value,
  );
}

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
) {
  const value =
    readPath(messages[locale], key) ?? readPath(messages[defaultLocale], key);

  return typeof value === "string" ? interpolate(value, params) : key;
}

export function getMessageValue(locale: Locale, key: MessageValueKey) {
  return (
    readPath(messages[locale], key) ?? readPath(messages[defaultLocale], key)
  );
}
