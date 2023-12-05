package expo.modules.mymodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ExpoObject: Record {
  @Field
  val duck: String = "quack"
}

class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Function("answer") {
      42
    }

    Function("getExpoRecord") {
      ExpoObject()
    }
  }
}
