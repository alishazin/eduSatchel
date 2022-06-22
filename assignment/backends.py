
def convert_date_to_array_for_more_details_data(dateObj):
    return [
        dateObj.strftime("%d"),
        dateObj.strftime("%m"),
        dateObj.strftime("%Y"),
        dateObj.strftime("%H"),
        dateObj.strftime("%M"),
    ]