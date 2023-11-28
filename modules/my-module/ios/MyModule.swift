import ExpoModulesCore

struct ExpoObject: Record {
    @Field
    var duck: String = "quack"
}

public class MyModule: Module {
    public func definition() -> ModuleDefinition {
        Name("MyModule")

        Function("answer") {
            42
        }

        Function("getExpoRecord") {
            ExpoObject()
        }
    }
}
