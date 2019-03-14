import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {validateSync, ValidationError} from 'class-validator';
import {PropertyUtils} from './property.utils';

/**
 * Custom angular validator for pleerock class-validator decorators.
 */
export class DynaValidator {
  /**
   * Validate the value of the specified AbstractControl
   *
   * @param classConstructor class with the validation decorators
   */
  public static validateControl(classConstructor: new() => Object): ValidatorFn {
    return (control: FormControl) => {
      let valid = null;
      const controlName = DynaValidator.getControlName(control);
      if (controlName) {
        const obj: Object = new classConstructor();

        const transformedValue =
            PropertyUtils.transformPropertyValue(classConstructor, controlName, control.value);

        PropertyUtils.setProperty(obj, controlName, transformedValue);

        // TODO skipMissingProperties
        const valResult: ValidationError[] = validateSync(obj, { skipMissingProperties: false });

        if (valResult.length > 0) {
          const msgs: Array<String> =
              DynaValidator.convertValidationErrorToMsgsArray(valResult, controlName);
          if (msgs && msgs.length > 0) {
            valid = msgs;
          }
        }
      }
      return valid;
    };
  }


  private static convertValidationErrorToMsgsArray(
      result: ValidationError[], propertyName: string, msgs: Array<String> = []): Array<String> {
    for (const valid of result) {  // iterate list
      if (valid.property === propertyName && valid.constraints) {
        for (const constr in valid.constraints) {  // iterate object properties
          if (valid.constraints.hasOwnProperty(constr)) {
            msgs.push(valid.constraints[constr]);
          }
        }
      }
      if (valid.children && valid.children.length > 0) {
        this.convertValidationErrorToMsgsArray(
            valid.children, propertyName, msgs);  // find constraints in children
      }
    }

    return msgs;
  }


  private static getControlName(control: FormControl): string {
    let controlName: string = null;
    const parent = control.parent;

    if (parent instanceof FormGroup) {  // iterate only if parent is a FormGroup
      Object.keys(parent.controls).forEach((name) => {
        // compare passed control with child control
        if (control === parent.controls[name]) {  // if same references
          controlName = name;
        }
      });
    }
    return controlName;  // return the name or null if not found
  }
}
