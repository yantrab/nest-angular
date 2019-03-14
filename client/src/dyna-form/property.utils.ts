import {classToClass} from 'class-transformer';

/**
 * Utility methods for populating JavaScript properties.
 */
export class PropertyUtils {
  /**
   * Set the value of the specified property of the specified object instance,
   * no matter which property reference format is used, with no type conversions.
   *
   * @param obj Object instance whose property is to be modified
   * @param prop Nested or simple name of the property to be modified
   * @param value Value to which this property is to be set
   */
  public static setProperty(obj: Object, prop: string|string[], value: any) {
    if (typeof prop === 'string') {
      prop = prop.split('.');
    }

    if (prop.length > 1) {
      const e = prop.shift();
      let curProp;

      if (Object.prototype.toString.call(obj[e]) === '[object Object]') {
        curProp = obj[e];
      } else {
        const targetType = (Reflect as any).getMetadata('design:type', obj, e);
        if (targetType) {
          curProp = new (targetType as any)();
        } else {
          curProp = {};
        }
      }
      PropertyUtils.setProperty(obj[e] = curProp, prop, value);
    } else {
      obj[prop[0]] = value;
    }
  }

  /**
   * Return the value of the specified property of the specified object instance,
   * no matter which property reference format is used, with no type conversions.
   *
   * @param obj Object instance whose property is to be extracted
   * @param prop Nested or simple name of the property to be extracted
   *
   * @returns the property value
   */
  public static getProperty(obj: Object, prop: string|string[]): any {
    if (typeof prop === 'string') {
      prop = prop.split('.');
    }

    let propValue: any = null;

    if (prop.length > 1) {
      const e = prop.shift();

      if (obj[e]) {
        propValue = PropertyUtils.getProperty(obj[e], prop);
      }

    } else {
      propValue = obj[prop[0]];
    }

    return propValue;
  }


  /**
   * Transform the given value to the specified type decorator of the property
   *
   * @param classConstructor Class constructor with the specified type decorator
   * @param prop Nested or simple name of the property
   * @param value Value which is transformed
   *
   * @returns the transformed property value
   */
  public static transformPropertyValue(
      classConstructor: new() => Object, prop: string|string[], value: any): any {
    let obj = new classConstructor();
    PropertyUtils.setProperty(obj, prop, value);

    // transform the values
    obj = classToClass(obj);

    const val = PropertyUtils.getProperty(obj, prop);

    return val;
  }
}
