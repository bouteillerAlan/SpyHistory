// set each unauthorized id for each back story choice

// why ? ->
// The player's choices only impact certain parts of the quests and most seasons are unaffected by the choices.
// It is therefore simpler to say which one is forbidden than to list all the authorized quests.

const backStories = {
    // human choices
    // 124,116,113,111,112,114
    '21-105' : [123,109,106,108,107,110, 115,118,119,120,121,122],
    // 123,109,106,108,107,110
    '21-106' : [124,116,113,111,112,114, 115,118,119,120,121,122],
    // 115,118,119,120,121,122
    '21-107' : [123,109,106,108,107,110, 124,116,113,111,112,114],
    // 125,126,127,128,139
    '22-109' : [134,135,137,136,138, 129,130,132,131,133],
    // 134,135,137,136,138
    '22-110' : [125,126,127,128,139, 129,130,132,131,133],
    // 129,130,132,131,133
    '22-108' : [125,126,127,128,139, 134,135,137,136,138],

    // asura choices
    // 17,16,22,18,19,20
    '10-68' : [25,28,29,30,31,33 ,21,24,23,26,32,27],
    // 25,28,29,30,31,33
    '10-67' : [17,16,22,18,19,20, 21,24,23,26,32,27],
    // 21,24,23,26,32,27
    '10-69' : [17,16,22,18,19,20, 25,28,29,30,31,33],
    // 34,32,37,36,38
    '11-72' : [44,45,48,46,47, 39,40,43,41,42],
    // 44,45,48,46,47
    '11-71' : [34,32,37,36,38, 39,40,43,41,42],
    // 39,40,43,41,42
    '11-70' : [34,32,37,36,38, 44,45,48,46,47],

    // char choices
    // 60,61,65,63,66,68
    '15-85' : [71,72,74,73,75,76, 59,62,64,67,69,70],
    // 71,72,74,73,75,76
    '15-84' : [60,61,65,63,66,68, 59,62,64,67,69,70],
    // 59,62,64,67,69,70
    '15-86' : [60,61,65,63,66,68, 71,72,74,73,75,76],
    // 83,84,85,87,86
    '17-94' : [78,79,80,81,82, 88,89,90,91,92],
    // 78,79,80,81,82
    '17-92' : [83,84,85,87,86, 88,89,90,91,92],
    // 88,89,90,91,92
    '17-93' : [83,84,85,87,86, 78,79,80,81,82],

    // norn choices
    // 155,157,158,160,161,156
    '26-121' : [162,164,169,168,170,171, 159,163,165,166,167,172],
    // 162,164,169,168,170,171
    '26-123' : [155,157,158,160,161,156, 159,163,165,166,167,172],
    // 159,163,165,166,167,172
    '26-122' : [155,157,158,160,161,156, 162,164,169,168,170,171],
    // 173,174,176,182,181
    '27-124' : [184,183,185,187,186, 175,177,178,179,180],
    // 184,183,185,187,186
    '27-126' : [173,174,176,182,181, 175,177,178,179,180],
    // 175,177,178,179,180
    '27-125' : [173,174,176,182,181, 184,183,185,187,186],

    // sylvari choices
    // 203,205,208,218,211,219
    '32-142' : [212,213,214,215,217,216, 202,206,204,210,207,209],
    // 212,213,214,215,217,216
    '32-143' : [203,205,208,218,211,219, 202,206,204,210,207,209],
    // 202,206,204,210,207,209
    '32-141' : [203,205,208,218,211,219, 202,206,204,210,207,209],

    // 230,231,232,233,234
    '31-137' : [220,221,222,223,224, 225,226,228,227,229],
    // 220,221,222,223,224
    '31-138' : [230,231,232,233,234, 225,226,228,227,229],
    // 225,226,228,227,229
    '31-140' : [230,231,232,233,234, 220,221,222,223,224],

}

export default backStories
