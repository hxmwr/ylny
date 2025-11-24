import json
import sys
import os


def refactor_menu_json(file_path):
    """
    Reads a JSON file, moves specific menu items, filters fields, and overwrites the file.
    Target changes:
    1. Move "驾驶舱" and "能源监视" into "智能能源管理"'s children.
    2. For every item, keep only: id, displayName, url, route, icon, children, type.
    """

    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found.")
        return

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return

    # --- Step 1: Move Menu Items ---
    # Target: Move "驾驶舱" and "能源监视" to "智能能源管理"

    cockpit_node = None
    monitor_node = None
    smart_manage_node = None

    # We assume the structure is a list of menu items at the root
    if isinstance(data, list):
        # Identify the nodes by displayName
        # We iterate through a copy or use indices, but finding objects first is safer
        for item in data:
            name = item.get("displayName")
            if name == "驾驶舱":
                cockpit_node = item
            elif name == "能源监视":
                monitor_node = item
            elif name == "智能能源管理":
                smart_manage_node = item

        # Perform the move if all participants are found at the root
        if cockpit_node and monitor_node and smart_manage_node:
            print(
                "Found target nodes. Moving '驾驶舱' and '能源监视' to '智能能源管理'..."
            )

            # 1. Remove from root list
            # We create a new list excluding the moved items
            data = [
                item
                for item in data
                if item.get("displayName") not in ("驾驶舱", "能源监视")
            ]

            # 2. Add to '智能能源管理' children
            if "children" not in smart_manage_node or not isinstance(
                smart_manage_node["children"], list
            ):
                smart_manage_node["children"] = []

            # Insert at the beginning of the children list
            # Order: 驾驶舱 (first), 能源监视 (second) -> reversed when inserting at 0
            smart_manage_node["children"].insert(0, monitor_node)
            smart_manage_node["children"].insert(0, cockpit_node)

        else:
            print(
                "Note: Could not find all target nodes at the root level. Skipping move step (they might already be moved)."
            )
    else:
        print("Warning: Root is not a list, skipping move step.")

    # --- Step 2: Filter Fields ---
    allowed_fields = {"id", "displayName", "url", "route", "icon", "children", "type"}

    def filter_node(node):
        if isinstance(node, list):
            return [filter_node(item) for item in node]
        elif isinstance(node, dict):
            # Keep only allowed fields
            new_node = {k: v for k, v in node.items() if k in allowed_fields}

            # Recursively filter children if they exist
            if "children" in new_node and isinstance(new_node["children"], list):
                new_node["children"] = filter_node(new_node["children"])

            return new_node
        else:
            return node

    print("Filtering fields...")
    final_data = filter_node(data)

    # --- Save Result ---
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(final_data, f, indent=4, ensure_ascii=False)
        print(f"Successfully processed {file_path}")
    except Exception as e:
        print(f"Error writing file: {e}")


if __name__ == "__main__":
    target_file = "a.json"
    if len(sys.argv) > 1:
        target_file = sys.argv[1]

    refactor_menu_json(target_file)
