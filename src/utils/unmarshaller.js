import Console from "@/utils/Console";
import get from "@/utils/getters";

const errors = {
  planner: {
    config: {
      invalidJSON: "invalidJSON",
      invalidItemSegment: "invalidItemSegment",
      unrecognized: "unrecognized"
    }
  }
}

export default {
  planner: {
    config: {
      // for legacy config files with form
      // []ItemData
      //     which, ItemData = {id, need?, have?} | {name, need?, have?}
      legacy (config) {
        const convertedItems = [];
        const convertionErrors = []
        for (const [index, item] of config.entries()) {
          // `have` or `need` param check

          if (
            // if it is valid then we don't need to add the error message
            !(
              // we need whether a `need` or `have` param.
              // and if the config file have any of those param, it should also pass the validation

              // valid need OR valid have
              (item.hasOwnProperty("need") && Number.isInteger(item.need) && item.need >= 0) ||
              (item.hasOwnProperty("have") && Number.isInteger(item.have) && item.have >= 0)
            )
          ) {
            convertionErrors.push({
              index,
              item,
              reason: errors.planner.config.invalidItemSegment
            });

            Console.info("PlannerIO", item.hasOwnProperty("need"), Number.isInteger(item.need), item.need >= 0,
              item.hasOwnProperty("have"), Number.isInteger(item.have), item.have >= 0)
            Console.info("PlannerImport", "one of the item data is invalid. not importing this and continue to the next one (reason: need or have invalid): ", index, item)
            continue
          }

          // item identifier `id` or `name` check

          const haveId = item.hasOwnProperty("id"); // later versions use id to represent item
          const haveName = item.hasOwnProperty("name"); // older versions use (chinese) name to represent item
          if (haveId) {
            if (haveName) {
              // we don't need the name anymore if the item have an id
              delete item["name"]
            }
            // you are all good my friend!
            convertedItems.push(item)
          } else if (!haveId) {
            if (!haveName) {
              convertionErrors.push({
                index,
                item,
                reason: errors.planner.config.invalidItemSegment
              });
              Console.info("PlannerImport", "one of the item data is invalid. not importing this and continue to the next one (reason: no id or name): ", index, item)
              continue
            }
            const item = get.items.byName(item.name);
            convertedItems.push({
              id: item.itemId,
              need: item.need,
              have: item.have
            })
          }
        }

        return {
          converted: {
            items: convertedItems
          },
          errors: convertionErrors
        }
      },

      // for modern config files with header "@type" === "@penguin-statistics/planner/config"
      modern (config) {
        return {
          converted: config,
          errors: []
        }
      },

      // decode encoded config string, automatically determine the config version and convert accordingly
      auto (config) {
        let converted;
        try {
          converted = JSON.parse(config)
        } catch (e) {
          return {
            exception: errors.planner.config.invalidJSON
          }
        }

        if (Array.isArray(converted)) {
          // pure array matrix: old data format
          return this.legacy(converted)
        } else {
          // not an array... maybe it's a new data format.
          // need verification
          if (converted["@type"] === "@penguin-statistics/planner/config") {
            // yup this is the new data format.
            return this.modern(converted)
          } else {
            // hmmm doesn't seems right.
            return {
              exception: errors.planner.config.unrecognized
            }
          }
        }
      }
    },
  }
}