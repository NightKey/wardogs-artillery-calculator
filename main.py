from math import atan2, hypot, degrees

while True:
    artirelly_x = int(float(input("Enter artillery x: ")) * 10)
    artirelly_y = int(float(input("Enter artillery y: ")) * 10)
    print(f"{'-' * (20 + len(str(artirelly_x)))}")

    try:
        while True:
            target_x = int(float(input("Enter target x: ")) * 10)
            target_y = int(float(input("Enter target y: ")) * 10)
            dist_x = target_x - artirelly_x
            dist_y = target_y - artirelly_y
            range = hypot(dist_x, dist_y)
            bearing_r = atan2(dist_x, dist_y)
            bearing = (degrees(bearing_r) + 360) % 360
            text = f"Rage: {range:.2f}m, Bearing: {bearing:.2f}°"
            print(f"{text}\n{'-' * len(text)}")

    except KeyboardInterrupt:
        answer = input("Do you want to continue? [y/[n]]") or 'n'
        if answer.lower() == "n":
            break
