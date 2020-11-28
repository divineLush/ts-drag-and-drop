namespace App {
    export const AutoBind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value
        const adjDescriptor: PropertyDescriptor = {
            configurable: true,
            get () {
                return originalMethod.bind(this)
            }
        }

        return adjDescriptor
    }
}