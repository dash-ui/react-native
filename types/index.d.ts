import type { Falsy, StyleArguments } from "@dash-ui/styles";
import * as React from "react";
import * as RN from "react-native";
import type { O } from "ts-toolbelt";
import type { JsonValue, ValueOf, PartialDeep } from "type-fest";
export declare function createStyles<V extends Record<string, unknown> = DashTokens, T extends Record<string, Record<string, unknown>> = DashThemes, VT extends {
    [K in keyof T]: O.Merge<V, T[K], "deep">;
} & {
    default: V;
} = {
    [K in keyof T]: O.Merge<V, T[K], "deep">;
} & {
    default: V;
}>(options?: CreateStylesOptions<V, T>): {
    readonly styles: (<T_1 extends StyleMap<RNStyles, V>>(styleMap: T_1) => {
        (...args: StyleArguments<Extract<keyof T_1, string>>): RN.ViewStyle | RN.ImageStyle;
        styles: T_1;
    }) & {
        readonly one: <S extends RNStyles>(literals: string | TemplateStringsArray | S | StyleCallback<S, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => (createStyle?: unknown) => S;
        readonly cls: <S_1 extends RNStyles>(literals: string | S_1 | TemplateStringsArray | StyleCallback<S_1, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => S_1;
        readonly lazy: <Value extends JsonValue, S_2 extends RNStyles = RNStyles>(lazyFn: (value: Value) => StyleValue<S_2, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>) => (value?: Value | undefined) => S_2;
        readonly join: <S_3 extends RNStyles = RNStyles>(...css: string[]) => S_3;
        readonly tokens: VT;
        readonly themes: T;
    };
    readonly styled: {
        <StyleProps extends {}, Props extends {} = {}>(Component: React.ComponentType<Props>, styles?: StyledValue<Omit<Props, keyof StyleProps> & StyleProps, "style" extends keyof Props ? Extract<Props["style"], {}> : RNStyles, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>> | undefined): React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<Props, "style"> & {
            children?: ("children" extends keyof Props ? Props["children"] : React.ReactNode) | undefined;
            style?: StyleProp<"style" extends keyof Props ? Extract<Props["style"], {}> : RNStyles, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps> & React.RefAttributes<unknown>>;
        ActivityIndicator: <StyleProps_1 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_1, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.ActivityIndicatorProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_1> & React.RefAttributes<unknown>>;
        DrawerLayoutAndroid: <StyleProps_2 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_2, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.DrawerLayoutAndroidProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_2> & React.RefAttributes<unknown>>;
        FlatList: <StyleProps_3 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_3, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.FlatListProps<unknown>, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_3> & React.RefAttributes<unknown>>;
        Image: <StyleProps_4 extends {}>(literals: string | false | RN.ImageStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ImageStyle> | RN.RecursiveArray<RN.ImageStyle | RN.Falsy | RN.RegisteredStyle<RN.ImageStyle>> | StyledCallback<StyleProps_4, RN.ImageStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.ImageProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ImageStyle | RN.RegisteredStyle<RN.ImageStyle> | RN.RecursiveArray<RN.ImageStyle | RN.Falsy | RN.RegisteredStyle<RN.ImageStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_4> & React.RefAttributes<unknown>>;
        ImageBackground: <StyleProps_5 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_5, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.ImageBackgroundProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_5> & React.RefAttributes<unknown>>;
        KeyboardAvoidingView: <StyleProps_6 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_6, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.KeyboardAvoidingViewProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_6> & React.RefAttributes<unknown>>;
        Modal: <StyleProps_7 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_7, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.ModalProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_7> & React.RefAttributes<unknown>>;
        NavigatorIOS: <StyleProps_8 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_8, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.NavigatorIOSProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_8> & React.RefAttributes<unknown>>;
        RecyclerViewBackedScrollView: <StyleProps_9 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_9, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.RecyclerViewBackedScrollViewProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_9> & React.RefAttributes<unknown>>;
        RefreshControl: <StyleProps_10 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_10, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.RefreshControlProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_10> & React.RefAttributes<unknown>>;
        SafeAreaView: <StyleProps_11 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_11, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.ViewProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_11> & React.RefAttributes<unknown>>;
        ScrollView: <StyleProps_12 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_12, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.ScrollViewProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_12> & React.RefAttributes<unknown>>;
        SectionList: <StyleProps_13 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_13, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.SectionListProps<unknown, unknown>, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_13> & React.RefAttributes<unknown>>;
        SnapshotViewIOS: <StyleProps_14 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_14, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.SnapshotViewIOSProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_14> & React.RefAttributes<unknown>>;
        Switch: <StyleProps_15 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_15, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.SwitchProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_15> & React.RefAttributes<unknown>>;
        Text: <StyleProps_16 extends {}>(literals: string | false | RN.TextStyle | TemplateStringsArray | RN.RegisteredStyle<RN.TextStyle> | RN.RecursiveArray<RN.TextStyle | RN.Falsy | RN.RegisteredStyle<RN.TextStyle>> | StyledCallback<StyleProps_16, RN.TextStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.TextProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.TextStyle | RN.RegisteredStyle<RN.TextStyle> | RN.RecursiveArray<RN.TextStyle | RN.Falsy | RN.RegisteredStyle<RN.TextStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_16> & React.RefAttributes<unknown>>;
        TextInput: <StyleProps_17 extends {}>(literals: string | false | RN.TextStyle | TemplateStringsArray | RN.RegisteredStyle<RN.TextStyle> | RN.RecursiveArray<RN.TextStyle | RN.Falsy | RN.RegisteredStyle<RN.TextStyle>> | StyledCallback<StyleProps_17, RN.TextStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.TextInputProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.TextStyle | RN.RegisteredStyle<RN.TextStyle> | RN.RecursiveArray<RN.TextStyle | RN.Falsy | RN.RegisteredStyle<RN.TextStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_17> & React.RefAttributes<unknown>>;
        TouchableHighlight: <StyleProps_18 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_18, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.TouchableHighlightProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_18> & React.RefAttributes<unknown>>;
        TouchableNativeFeedback: <StyleProps_19 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_19, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.TouchableNativeFeedbackProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_19> & React.RefAttributes<unknown>>;
        TouchableOpacity: <StyleProps_20 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_20, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.TouchableOpacityProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_20> & React.RefAttributes<unknown>>;
        TouchableWithoutFeedback: <StyleProps_21 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_21, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.TouchableWithoutFeedbackProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_21> & React.RefAttributes<unknown>>;
        View: <StyleProps_11 extends {}>(literals: string | false | RN.ViewStyle | TemplateStringsArray | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>> | StyledCallback<StyleProps_11, RN.ViewStyle, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>, ...placeholders: string[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<RN.ViewProps, "style"> & {
            children?: React.ReactNode;
            style?: StyleProp<false | RN.ViewStyle | RN.RegisteredStyle<RN.ViewStyle> | RN.RecursiveArray<RN.ViewStyle | RN.Falsy | RN.RegisteredStyle<RN.ViewStyle>>, ValueOf<Omit<VT, "default">, Exclude<keyof VT, "default">>>;
        } & StyleProps_11> & React.RefAttributes<unknown>>;
    };
    readonly useDash: () => {
        styles: (<T_1 extends StyleMap<RNStyles, V>>(styleMap: T_1) => {
            (...args: StyleArguments<Extract<keyof T_1, string>>): RN.ViewStyle | RN.ImageStyle;
            styles: T_1;
        }) & {
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
export declare type StyleMap<S extends RNStyles, V extends Record<string, unknown> = DashTokens> = {
    [name: string]: string | StyleCallback<S, V> | StyleObject<S>;
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
