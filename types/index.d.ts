import type { Falsy, StyleArguments } from "@dash-ui/styles";
import * as React from "react";
import * as RN from "react-native";
import type { O } from "ts-toolbelt";
import type { JsonValue, PartialDeep, ValueOf } from "type-fest";
export declare function createStyles<V extends Record<string, unknown> = DashTokens, T extends Record<string, Record<string, unknown>> = DashThemes, VT extends {
    [K in keyof T]: O.Merge<V, T[K], "deep">;
} & {
    default: V;
} = {
    [K in keyof T]: O.Merge<V, T[K], "deep">;
} & {
    default: V;
}>(options?: CreateStylesOptions<V, T>): {
    readonly styles: {
        readonly variants: <T_1 extends StyleMap<RNStyles, V>>(styleMap: T_1) => {
            (...args: StyleArguments<Extract<keyof T_1, string | number>>): RN.ViewStyle | RN.ImageStyle;
            styles: T_1;
        };
        readonly one: <S extends RNStyles>(literals: string | TemplateStringsArray | S | StyleCallback<S, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => (createStyle?: unknown) => S;
        readonly cls: <S_1 extends RNStyles>(literals: string | S_1 | TemplateStringsArray | StyleCallback<S_1, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => S_1;
        readonly lazy: <Value extends JsonValue, S_2 extends RNStyles = RNStyles>(lazyFn: (value: Value) => StyleValue<S_2, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>) => (value?: Value | undefined) => S_2;
        readonly join: <S_3 extends RNStyles = RNStyles>(...css: string[]) => S_3;
        readonly tokens: VT;
        readonly themes: T;
    };
    readonly styled: <StyleProps extends {}, Props extends {} = {}>(Component: React.ComponentType<Props>, baseStyles?: StyledValue<Omit<Props, keyof StyleProps> & StyleProps, "style" extends keyof Props ? Extract<Props["style"], {}> : RNStyles, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>> | undefined, areEqual?: (keyof StyleProps)[] | (([tokens, props]: [ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>, Omit<Props, keyof StyleProps> & StyleProps], [nextTokens, nextProps]: [ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>, Omit<Props, keyof StyleProps> & StyleProps]) => boolean) | undefined) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<Props, "style"> & {
        children?: ("children" extends keyof Props ? Props["children"] : React.ReactNode) | undefined;
        style?: StyleProp<"style" extends keyof Props ? Extract<Props["style"], {}> : RNStyles, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
    } & StyleProps> & React.RefAttributes<unknown>>;
    readonly useDash: () => {
        styles: {
            readonly variants: <T_1 extends StyleMap<RNStyles, V>>(styleMap: T_1) => {
                (...args: StyleArguments<Extract<keyof T_1, string | number>>): RN.ViewStyle | RN.ImageStyle;
                styles: T_1;
            };
            readonly one: <S extends RNStyles>(literals: string | TemplateStringsArray | S | StyleCallback<S, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => (createStyle?: unknown) => S;
            readonly cls: <S_1 extends RNStyles>(literals: string | S_1 | TemplateStringsArray | StyleCallback<S_1, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => S_1;
            readonly lazy: <Value extends JsonValue, S_2 extends RNStyles = RNStyles>(lazyFn: (value: Value) => StyleValue<S_2, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>) => (value?: Value | undefined) => S_2;
            readonly join: <S_3 extends RNStyles = RNStyles>(...css: string[]) => S_3;
            readonly tokens: VT;
            readonly themes: T;
        };
        tokens: ValueOf<Omit<VT, "default">>;
        theme: keyof VT;
        setTheme(theme: keyof T | "default"): void;
        insertTokens(nextTokens: PartialDeep<V>): void;
        insertThemes(nextThemes: PartialDeep<Omit<VT, "default">>): void;
    };
    readonly DashProvider: ({ theme: controlledTheme, defaultTheme, onThemeChange, disableAutoThemeChange, children, }: {
        defaultTheme?: keyof T | "default" | undefined;
        theme?: keyof T | "default" | undefined;
        onThemeChange?: ((theme: keyof T | "default") => void) | undefined;
        disableAutoThemeChange?: boolean | undefined;
        children?: React.ReactNode;
    }) => JSX.Element;
};
/**
 * A utility function that will compile style objects and callbacks into CSS strings.
 *
 * @param styles - A style callback, object, or string
 * @param tokens - A map of CSS tokens for style callbacks
 */
export declare function compileStyles<S extends RNStyles = RNStyles, V extends Record<string, unknown> = DashTokens>(styles: StyleValue<S, V> | Falsy, tokens: V): S;
export declare type Styles = ReturnType<typeof createStyles>;
export interface CreateStylesOptions<V extends DashTokens = DashTokens, T extends Record<string, unknown> = DashThemes> {
    readonly tokens?: V;
    readonly themes?: {
        [Name in keyof T]: T[Name];
    };
}
export declare type StyleMap<S extends RNStyles, V extends Record<string | number, unknown> = DashTokens> = {
    [name: string | number]: string | StyleCallback<S, V> | StyleObject<S>;
};
export declare type StyleValue<S extends RNStyles = RNStyles, V extends Record<string, unknown> = DashTokens> = string | StyleCallback<S, V> | StyleObject<S>;
export declare type StyleObject<S extends RNStyles = RNStyles> = S;
export declare type StyleCallback<S extends RNStyles = RNStyles, V extends Record<string, unknown> = DashTokens> = (tokens: V) => StyleObject<S> | string;
export declare type StyledValue<P extends {} = {}, S extends RNStyles = RNStyles, V extends Record<string, unknown> = DashTokens> = string | StyledCallback<P, S, V> | StyleObject<S>;
export declare type StyledCallback<P extends {} = {}, S extends RNStyles = RNStyles, V extends Record<string, unknown> = DashTokens> = (tokens: V, props: P) => StyleObject<S> | string;
export declare type StyleProp<S extends RN.Falsy | RNStyles | RN.RegisteredStyle<RNStyles> | RN.RecursiveArray<StylePropBase> = RNStyles, V extends Record<string, unknown> = DashTokens> = RN.RecursiveArray<StylePropBase<Extract<S, {}>, V> | RN.Falsy> | StylePropBase<Extract<S, {}>, V>;
declare type StylePropBase<S extends RNStyles = RNStyles, V extends Record<string, unknown> = DashTokens> = StyleValue<S, V> | RN.RegisteredStyle<S> | RN.Falsy;
export declare type RNStyles = RN.ViewStyle | RN.TextStyle | RN.ImageStyle;
export interface DashTokens extends Record<string, unknown> {
}
export interface DashThemes extends Record<string, Record<string, unknown>> {
}
/**
 * The names of the themes defined in the `DashThemes` type
 */
export declare type DashThemeNames = Extract<keyof DashThemes, string>;
export {};
