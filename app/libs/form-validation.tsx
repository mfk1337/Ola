/**
 * Validation of inputfields
 * @param InputFieldDataAndRules array of input & rules, all are required
 *  fieldname: String
 *  fieldvalue: String
 *  NOT IMPLENTED YET: fieldtype: Options: 'text' | 'password' | 'email' | 'checkbox' (String)
 *  minchars: number - If number is 0, doesnt check min. chars in string.
 * 
 * @returns boolean
 * 
 */  

interface InputFieldDataAndRules {
    fieldname: string,
    fieldvalue: string,
    fieldtype: string,
    minchars: number,
}

export const formInputValidation = (inputFields: InputFieldDataAndRules[])=> {

    var validate = true

    inputFields.map((item) => {
       
        if(!item.fieldvalue.trim()) {
            validate = false            
            return
        }

        if(item.minchars > 0 && item.fieldvalue.trim().length < item.minchars) {
            validate = false            
            return
        }

    })

   return validate

}