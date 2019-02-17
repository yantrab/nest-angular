/**
 * Utility methods for dyna metadata.
 */
export class DynaMetaUtils {
  public static readonly DYNA_META_CONSTRUCTOR = 'dyna:constructor';


  public static setMetaConstructor(classConstructor: new() => Object, instance: any) {
    (Reflect as any)
        .defineMetadata(DynaMetaUtils.DYNA_META_CONSTRUCTOR, classConstructor, instance);
  }

  public static getMetaConstructor(instance: any): new() => Object {
    const constructor = (Reflect as any).getMetadata(DynaMetaUtils.DYNA_META_CONSTRUCTOR, instance);

    return constructor;
  }
}