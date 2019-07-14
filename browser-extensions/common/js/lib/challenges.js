
/*
 * Some volunteer roles have changed names, or a role has been deprecated,
 * or it makes sense to know a role by another name. This attempts to do that.
 * Could be done way much cleaner but this has to work for now.
 */

volunteer_roles_map = [
    {"shortname": "equipment-storage", "name": "Przechowując(a)y sprzęt"},
    {"shortname": "comms-person", "name": "Osoba od komunikacji"},
    {"shortname": "volunteer-coordinator", "name": "Koordynator woluntariuszy"},
    {"shortname": "event-day-course-check", "name": "Ustawiając(a)y elementy trasy"},
    {"shortname": "setup", "name": "Instruktor nowych uczestników"},
    {"shortname": "car-park-marshal", "name": "Koordynator parkingu"},
    {"shortname": "first-timers-briefing", "name": "Instruktor nowych uczestników"},
    {"shortname": "sign-language", "name": "Tłumacz języka migowego"},
    {"shortname": "marshal", "name": "Ubezpieczając(a)y trasę"},
    {"shortname": "tail-walker", "name": "Zamykając(a)y stawkę"},
    {"shortname": "run-director", "name": "Koordynator biegu"},
    {"shortname": "lead-bike", "name": "Rower bezpieczeństwa"},
    {"shortname": "pacer", "name": "Wyznaczając(a)y tempo", "matching-roles": ["Wyznaczając(a)y tempo"]},
    {"shortname": "vi-guide", "name": "Przewodnik dla słabowidzących", "matching-roles": ["Przewodnik dla słabowidzących"]},
    {"shortname": "photographer", "name": "Fotograf"},
    {"shortname": "timer", "name": "Osoba mierząca czas", "matching-roles": ["Osoba mierząca czas", "Zapasowy pomiar czasu"]},
    {"shortname": "funnel-manager", "name": "Koordynator tunelu mety"},
    {"shortname": "finish-tokens", "name": "Pozycje na mecie", "matching-roles": ["Pozycje na mecie", "Asystując(a)y przy pozycjach"]},
    {"shortname": "barcode-scanning", "name": "Skanując(a)y uczestników"},
    {"shortname": "manual-entry", "name": "Sprawdzając(a)y pozycje na mecie"},
    {"shortname": "close-down", "name": "Zbierając(a)y elementy trasy"},
    {"shortname": "results-processing", "name": "Wprowadzając(a)y wyniki"},
    {"shortname": "token-sorting", "name": "Osoba sortująca tokeny"},
    {"shortname": "run-report-writer", "name": "Przygotowując(a)y raport z biegu"},
    {"shortname": "other", "name": "Inne"},
]

function group_volunteer_data(volunteer_data) {
  // Populate the results with the above

  grouped_volunteer_data = []

  volunteer_roles_map.forEach(function (role) {
    grouped_volunteer_data[role["name"]] = 0
    if (role["matching-roles"] !== undefined){
        for (var i=0; i<role["matching-roles"].length; i++) {
            if (role["matching-roles"][i] in volunteer_data) {
                grouped_volunteer_data[role["name"]] += volunteer_data[role["matching-roles"][i]]
            }
        }
    } else {
      if (role.name in volunteer_data) {
          // console.log("Completed "+role.name+" "+volunteer_data[role.name]+" times")
          grouped_volunteer_data[role["name"]] = volunteer_data[role.name]
      }
    }
  })

  return grouped_volunteer_data
}

/*
 * These functions provide a way to generate the data relating to challenge
 * based on the results provided to them. This includes if the challenge
 * is complete, how many subparts there are, and how far you have to go etc..
 */

function generate_running_challenge_data(data) {
  // console.log(data)
  challenge_data = []

  if (data.parkrun_results) {
    challenge_data.push(challenge_tourist(data, {
      "shortname": "tourist",
      "name": "Turysta",
      "data": 20,
      "help": "Ukończ 20+ lokalizacji parkrun gdziekolwiek na świecie."}))
    challenge_data.push(challenge_start_letters(data, {
      "shortname": "alphabeteer",
      "name": "Alfabet",
      "data": "abcdegjklłoprsśtwzż",
      "help": "Ukończ parkrun w lokalizacjach, których nazwy zaczynają się od liter polskiego alfabetu (oprócz tych obecnie nieistniejących)."}))
    challenge_data.push(challenge_start_letters(data, {
      "shortname": "diacritic-alph",
      "name": "Diakrytyczny",
      "data": "łśż",
      "help": "Ukończ parkrun w lokalizacjach, których nazwy zaczynają się od liter ł, ś i ż."}))
    challenge_data.push(challenge_start_letters(data, {
      "shortname": "custom-word",
      "name": "Polska",
      "data": "polska",
      "help": "Ukończ parkrun w lokalizacjach, których nazwy zaczynają się od liter układających się w słowo Polska."}))
    challenge_data.push(challenge_start_letters(data, {
      "shortname": "gieksa",
      "name": "GieKSa 5:0",
      "data": "gksgksgksgksgks",
      "help": "Ukończ parkrun w lokalizacjach, których nazwy zaczynają się od liter układających się w skrót GKS. Specjalnie dla parkrunnerów z Katowic. Cóż innego można zrobić z ośmioma lokalizacjami na G, 9 na K oraz 5 na S?!"}))
    challenge_data.push(challenge_start_letters(data, {
      "shortname": "g8-group",
      "name": "Grupa G8",
      "data": "gggggggg",
      "help": "Ukończ parkrun w ośmiu lokalizacjach, których nazwy zaczynają się od liter G."}))
    challenge_data.push(challenge_single_parkrun_count(data, {
      "shortname": "single-ton",
      "name": "Lokalny patriota na 100%",
      "data": 100,
      "help": "Ukończ 100+ parkrun w tej samej lokalizacji."}))
    challenge_data.push(challenge_single_parkrun_count(data, {
      "shortname": "double-ton",
      "name": "Lokalny patriota na 200%",
      "data": 200,
      "help": "Ukończ 200+ parkrun w tej samej lokalizacji."}))
    challenge_data.push(challenge_finish_position_bingo(data, {
      "shortname": "finish-position-bingo",
      "name": "Pozycyjne Bingo",
      "help": " Zbierz wszystkie miejsca, od 1 do 100 w wynikach parkrun. Brana jest pod uwagę ogólna pozycja modulo 100, tzn. licznik przekręca się powyżej setki, dla większej dostępności wyzwania."}))
    challenge_data.push(challenge_stopwatch_bingo(data, {
      "shortname": "stopwatch-bingo",
      "name": "Stoperowe Bingo",
      "help": " Zbierz wszystkie sekundy, od 00 do 59."}))
    challenge_data.push(challenge_metronome(data, {
      "shortname": "metronome",
      "name": "Metronom",
      "help": "Ukończ parkrun z tym samym czasem podczas 10 różnych okazji."}))
    challenge_compass_club_regions(data, challenge_data)
    challenge_data.push(challenge_words(data, {
      "shortname": "lake-club",
      "name": "Władca Jezior",
      "data": ["Jezioro Górne","Jezioro Swarzędzkie","Jezioro Zatorze"],
      "help": "Ukończ parkrun we wszystkich lokalizacjach Polski z jeziorem w nazwie."}))
    challenge_data.push(challenge_words(data, {
      "shortname": "park-club",
      "name": "Spacerek po parku",
      "data": ["Park miejski","Park na wyspie","Park zdrojowy"],
      "help": "Ukończ parkrun we wszystkich lokalizacjach Polski z parkiem w nazwie."}))
    challenge_data.push(challenge_parkruns(data, {
      "shortname": "full-ponty",
      "name": "Stolica",
      "data": ["Pole Mokotowskie","Warszawa-Ursynów","Warszawa-Praga","Warszawa-Żoliborz","Warszawa-Bródno"],
      "help": "Ukończ wszystkie lokalizacje w stolicy."}))
    challenge_data.push(challenge_parkruns(data, {
      "shortname": "pilgrimage",
      "name": "Pielgrzymka",
      "data": ["Las Aniołowski", "Toruń"],
      "help": "Ukończ parkrun w Częstochowie i Toruniu."}))
    // Note for the dates, the month is zero indexed (0-11), the day of the month is (1-31)
    challenge_data.push(challenge_on_dates(data, {
      "shortname": "boxing-day",
      "name": "Drugi Dzień Świąt",
      "data": [
          {"month": 11, "day": 26}
        ],
        "help": "Ukończ parkrun 26 grudnia."}))
    challenge_data.push(challenge_nyd_double(data, {
      "shortname": "nyd-double",
      "name":  "Dubel Noworoczny",
      "help": "Ukończ dwa parkrun tego samego dnia w Nowym Roku."}))
    challenge_data.push(challenge_groundhog_day(data, {
      "shortname": "groundhog-day",
      "name": "Dzień Świstaka",
      "help": "Ukończ z tym samym czasem, w tej samej lokalizacji w dwóch kolejnych parkrun."}))
    challenge_data.push(challenge_habitual(data, {
      "shortname": "habitual",
      "name": "Siła przyzwyczajenia",
      "help": "Ukończ parkrun na tej samej pozycji podczas 10 różnych okazji."}))
    challenge_data.push(challenge_on_dates(data, {
      "shortname": "all-weather-runner",
      "name": "Nie ma złej pogody na parkrun",
      "data": [
        {"month": 0},
        {"month": 1},
        {"month": 2},
        {"month": 3},
        {"month": 4},
        {"month": 5},
        {"month": 6},
        {"month": 7},
        {"month": 8},
        {"month": 9},
        {"month": 10},
        {"month": 11},
      ],
      "help": "Ukończ parkrun w każdym miesiącu roku."}))
    challenge_data.push(challenge_on_dates(data, {
      "shortname": "callendar-runner",
      "name": "Wyrywam kartki z kalendarza",
      "data": [
          {"day": 1},
          {"day": 2},
          {"day": 3},
          {"day": 4},
          {"day": 5},
          {"day": 6},
          {"day": 7},
          {"day": 8},
          {"day": 9},
          {"day": 10},
          {"day": 11},
          {"day": 12},
          {"day": 13},
          {"day": 14},
          {"day": 15},
          {"day": 16},
          {"day": 17},
          {"day": 18},
          {"day": 19},
          {"day": 20},
          {"day": 21},
          {"day": 22},
          {"day": 23},
          {"day": 24},
          {"day": 25},
          {"day": 26},
          {"day": 27},
          {"day": 28},
          {"day": 29},
          {"day": 30},
          {"day": 31},
        ],
      "help": "Ukończ parkrun w każdym możliwym dniu (dowolnego) miesiąca."}))
    challenge_data.push(challenge_in_a_year(data, {
      "shortname": "obsessive-wood",
      "name": "Drewniana Obsesja",
      "data": 10,
      "help": "Ukończ 10+ parkrunów jednym roku kalendarzowym."}))
    challenge_data.push(challenge_in_a_year(data, {
      "shortname": "obsessive-iron",
      "name": "Żelazna Obsesja",
      "data": 20,
      "help": "Ukończ 20+ parkrunów jednym roku kalendarzowym"}))
    challenge_data.push(challenge_in_a_year(data, {
      "shortname": "obsessive-bronze",
      "name": "Brązowa Obsesja",
      "data": 30,
      "help": "Ukończ 30+ parkrunów jednym roku kalendarzowym"}))
    challenge_data.push(challenge_in_a_year(data, {
      "shortname": "obsessive-silver",
      "name": "Srebrna Obsesja",
      "data": 40,
      "help": "Ukończ 40+ parkrunów jednym roku kalendarzowym"}))
    challenge_data.push(challenge_in_a_year(data, {
      "shortname": "obsessive-gold",
      "name": "Złota Obsesja",
      "data": 50,
      "help": "Ukończ 50+ parkrunów jednym roku kalendarzowym"}))
  }

  if (data.parkrun_results && data.geo_data) {
    challenge_data.push(challenge_by_region(data, {
      "shortname": "regionnaire",
      "name": "Klub Basi Brzezińskiej",
      "help": "Ukończ wszystkie lokalizacje w danym kraju/regionie."}))
  }

  return challenge_data
}

function generate_volunteer_challenge_data(data) {

  var volunteer_challenge_data = []

  if (data.volunteer_data) {
    volunteer_data = data.volunteer_data

    volunteer_roles = group_volunteer_data(volunteer_data)

    // Populate the results with the above
    volunteer_roles_map.forEach(function (role) {
        var this_role_data = create_data_object(role, "volunteer")
        this_role_data.summary_text = ""
        this_role_data.subparts_completed_count = volunteer_roles[role["name"]]
        if (this_role_data.subparts_completed_count > 0) {
            this_role_data.summary_text = "x"+this_role_data.subparts_completed_count
            this_role_data.complete = true
        } else {
            this_role_data.summary_text = '-'
        }

        update_data_object(this_role_data)
        volunteer_challenge_data.push(this_role_data)
    })
  }

  return volunteer_challenge_data
}

// Function adapted from https://www.movable-type.co.uk/scripts/latlong.html
function calculate_great_circle_distance(point1, point2) {

  if (point1.lat == '' || point1.lon == '' || point2.lat == '' || point2.lon == '') {
    return 0
  }

  var R = 6371; // km
  var φ1 = point1.lat * Math.PI / 180;
  var φ2 = point2.lat * Math.PI / 180;
  var Δφ = (point2.lat-point1.lat) * Math.PI / 180;
  var Δλ = (point2.lon-point1.lon) * Math.PI / 180;

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;

  return d
}

// These stat generation functions are all separate for each of maintenance
// They would be quicker if they were all in one loop, but it makes testing
// and extending them harder

// How many runs in total
function generate_stat_total_runs(parkrun_results) {
  var total_runs = 0
  parkrun_results.forEach(function (parkrun_event) {
    // Count the total runs
    total_runs += 1
  })
  return {
    "display_name": "Ukończonych parkrun",
    "help": "Całkowita liczba wszystkich ukończonych parkrun.",
    "value": total_runs
  }
}

// How many PBs in total
function generate_stat_total_pbs(parkrun_results) {
  var total_pbs = 0
  parkrun_results.forEach(function (parkrun_event) {
    // Count the number of PBs
    if (parkrun_event.pb) {
      total_pbs += 1
    }
  })
  return {
    "display_name": "Liczba życiówek",
    "help": "Całkowita liczba życiówek na wszystkich parkrun.",
    "value": total_pbs
  }
}

// Maximum number of consecutive PBs in the results table
function generate_stat_longest_pb_streak(parkrun_results) {
  var longest_pb_streak = 0
  var this_pb_streak = 0
  parkrun_results.forEach(function (parkrun_event) {
    // Count the number of consecutive PBs
    if (parkrun_event.pb) {
      // Increment this PB streak, and if it exceeds the max, make it that too
      this_pb_streak += 1
      if (this_pb_streak > longest_pb_streak) {
        longest_pb_streak = this_pb_streak
      }
    } else {
      // Reset the PB streak
      this_pb_streak = 0
    }
  })
  return {
    "display_name": "Najdłuższa życiówkowa passa",
    "help": "Największa liczba następujących po sobie życiówek, we wszystkich lokalizacjach.",
    "value": longest_pb_streak + " parkrun"
  }
}

// Sum of all parkrun distances ran, +5km for regular, +2km if there is 'junior'
// in the name of the event
function generate_stat_total_distance_ran(parkrun_results) {
  var total_distance_ran = 0
  parkrun_results.forEach(function (parkrun_event) {
    // Find the distance this athlete has run (juniors is 2k, else 5k)
    if (parkrun_event.name.toLowerCase().includes('juniors')) {
      total_distance_ran += 2
    } else {
      total_distance_ran += 5
    }
  })
  return {
    "display_name": "Całkowity dystans na parkrun",
    "help": "Całkowity dystans pokonany na parkrun.",
    "value": total_distance_ran+" km"
  }
}

// Maximum number of runs in a calendar year, as determined from the date
// run in the results table
function generate_stat_most_runs_in_a_year(parkrun_results) {
  var runs_per_year = {}
  var value = "Brak"
  // Group results by year
  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.date_obj.getFullYear() in runs_per_year)) {
      runs_per_year[parkrun_event.date_obj.getFullYear()] = 0
    }
    runs_per_year[parkrun_event.date_obj.getFullYear()] += 1
  })
  // Sort years by number of runs descending
  var best_year_sorted = Object.keys(runs_per_year).sort(function(a, b) {
      return runs_per_year[b] - runs_per_year[a]
  })
  // Find all the years with the maximum value
  var best_years = []
  if (best_year_sorted.length > 0) {
    best_year_sorted.forEach(function (year){
      if (runs_per_year[year] == runs_per_year[best_year_sorted[0]]) {
        best_years.push(year)
      }
    })
    value = runs_per_year[best_year_sorted[0]] + " w " + best_years.join(", ")
  }

  return {
    "display_name": "Najwięcej parkrun w roku",
    "help": "Największa liczba parkrun w roku kalendarzowym.",
    "value": value
  }
}

// The number of parkruns that satisfy the equation 'p parkruns run at least p times'
// E.g. you have run 4 different parkruns at least 4 times.
function generate_stat_p_index(parkrun_results) {
  var p_index = 0
  var event_attendance_tally = {}

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in event_attendance_tally)) {
      event_attendance_tally[parkrun_event.name] = 0
    }
    event_attendance_tally[parkrun_event.name] += 1
  })
  // Sort events by number of runs descending
  var event_attendance_sorted = Object.keys(event_attendance_tally).sort(function(a, b) {
      return event_attendance_tally[b] - event_attendance_tally[a]
  })
  // Iterate through the events, and as long as the numbers of times we have
  // run at the even is greater than the index value, increment the p-index
  event_attendance_sorted.forEach(function(event_name, index) {
    if (event_attendance_tally[event_name] > index) {
      p_index += 1
    }
  })
  return {
    "display_name": "Współczynnik p",
    "help": "Liczba parkrun, która spełnia następującą formułę: 'p lokalizacji parkrun ukończone co najmniej p razy'. Np. jeśli ukończysz parkrun w 4 różnych lokalizacjach co najmniej po 4 razy w każdej, współczynnik p wyniesie 4.",
    "value": p_index
  }
}

// The number of volunteer roles which have been performed at least _v_ times.
// E.g. If you have volunteered in 4 different roles at least 4 times, your v-index
// is 4.
function generate_stat_v_index(volunteer_data) {

  volunteer_roles = group_volunteer_data(volunteer_data)

  var v_index = 0
  var descending_tally = Object.keys(volunteer_roles).sort(function(a, b) {
    return volunteer_roles[b] - volunteer_roles[a]
  })
  // Iterate through the roles, and as long as the number of times we have
  // volunteered in the role is greater than the index value, increment the
  // v-index
  descending_tally.forEach(function(role_name, index) {
    // console.log("index: " + index + " is " + role_name + " which has been completed " + volunteer_roles[role_name] + " times")
    if (volunteer_roles[role_name] > index) {
      v_index += 1
    }
  })
  return {
    "display_name": "Współczynnik v",
    "help": "Liczba ról wolontariackich pełnionych co najmniej v razy. Np. jeśli co najmniej 4 razy pełnione były 4 role, współczynnik v wynosi 4.",
    "value": v_index
  }
}

// The maximum contiguous series of parkrun event numbers you have attended
// (at any event), starting at 1.
function generate_stat_wilson_index(parkrun_results) {
  var wilson_index = 0
  var event_numbers_visited = {}

  parkrun_results.forEach(function (parkrun_event) {
    event_numbers_visited[parkrun_event.event_number] = true
  })
  // Iterate through the maximum set of event numbers they could have, and check
  // if each is in the object, we stop when we can't find one
  var index
  for (index=1; index<Object.keys(event_numbers_visited).length; index++) {
    if (index in event_numbers_visited) {
      wilson_index += 1
    } else {
      break
    }
  }
  return {
    "display_name": "Współczynnik Wilsona",
    "help": "Maksymalna liczba następująych po sobie (kolejnych) edycji (zaliczonych w dowolnej lokalizacji) i zaczynających się od 1 edycji (inauguracji).",
    "value": wilson_index
  }
}

// What date was this athlete's first run
function generate_stat_parkrun_birthday(parkrun_results) {
  var birthday = "-"
  if (parkrun_results.length > 0) {
    birthday_date = parkrun_results[0].date_obj
    // Format the date as a string with the user's locale
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    // for more options
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // In en-GB this gives something like : "Thursday, 20 December 2012"
    // in en-US it would be "Thursday, December 20, 2012"
    // in pl-PL it would be "czwartek, 20 grudnia 2012"
    birthday = birthday_date.toLocaleDateString(undefined, options);
  }
  return {
    "display_name": "Pierwszy parkrun",
    "help": "Data Twojego pierwszego zarejestrowanego parkrun!",
    "value": birthday
  }
}

function generate_stat_finish_index(parkrun_results) {
  var positions = []
  parkrun_results.forEach(function (parkrun_event) {
      positions.push(parseInt(parkrun_event.position))
  })
  positions.sort(function (position1, position2) { return position1 - position2 })
  var currentStreak = 0
  var longestStreak = 0
  var longestStreakLastPosition = -1
  var lastPosition = -1
  positions.forEach(function (position) {
      if (position == lastPosition + 1) {
          currentStreak++
      } else if (position > lastPosition + 1) {
          if (currentStreak > longestStreak) {
              longestStreak = currentStreak
              longestStreakLastPosition = lastPosition
          }
          currentStreak = 1
      }
      lastPosition = position
  })
  if (currentStreak > longestStreak) {
      longestStreak = currentStreak
      longestStreakLastPosition = lastPosition
  }
  return {
      "display_name": "Wskaźnik pozycji",
      "help": "Maksymalna liczba następujących po sobie miejsc, jakie osiągnąłeś (w dowolnej lokalizacji), zaczynając od dowolnej pozycji.",
      "value": longestStreak + " - od miejsca " + (longestStreakLastPosition - longestStreak + 1) + " do " + longestStreakLastPosition
  }
}

function generate_stat_gossit_index(parkrun_results) {
  var durations = []
  parkrun_results.forEach(function (parkrun_event) {
      durations.push(parkrun_event.duration)
  })
  durations.sort(function (duration1, duration2) { return duration1 - duration2 })
  var currentStreak = 0
  var longestStreak = 0
  var longestStreakLastDuration = -1
  var lastDuration = -1
  durations.forEach(function (duration) {
      if (duration == lastDuration + 1) {
          currentStreak++
      } else if (duration > lastDuration + 1) {
          if (currentStreak > longestStreak) {
              longestStreak = currentStreak
              longestStreakLastDuration = lastDuration
          }
          currentStreak = 1
      }
      lastDuration = duration
  })
  if (currentStreak > longestStreak) {
      longestStreak = currentStreak
      longestStreakLastDuration = lastDuration
  }
  var streakStartTime = Math.floor((longestStreakLastDuration - longestStreak + 1) / 60) + ":" + ((longestStreakLastDuration - longestStreak + 1) % 60)
  var streakFinishTime = Math.floor(longestStreakLastDuration / 60) + ":" + (longestStreakLastDuration % 60)
  return {
      "display_name": "Wskaźnik Gossita",
      "help": "Maksymalna liczba następujących po sobie czasów (jakie osiągnąłeś w dowolnej lokalizacji), zaczynając od dowolnego czasu.",
      "value": longestStreak + " - od " + streakStartTime + " do " + streakFinishTime
  }
}

// Total number of years parkrunning, if today if your anniversary it will go up
function generate_stat_years_parkrunning(parkrun_results) {
  var years = 0
  if (parkrun_results.length > 0) {
    var birthday_date = parkrun_results[0].date_obj
    var now = new Date()
    // .getDay() returns the day of the week (0-6)
    // .getDate() returns the day of the month (1-31)
    // So be careful when comparing!
    if (now.getMonth() > birthday_date.getMonth() || (now.getMonth() == birthday_date.getMonth() && now.getDate() >= birthday_date.getDate())) {
      years = now.getFullYear() - birthday_date.getFullYear()
    } else {
      years = now.getFullYear() - birthday_date.getFullYear() - 1
    }
  }
  return {
    "display_name": "Staż na parkrun",
    "help": "Ile lat pojawiasz się na parkrun jako uczestnik.",
    "value": years
  }
}

function generate_stat_events_run(parkrun_results) {
  // Find those parkrun events that have been completed
  var events_run = {}

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in events_run)) {
      events_run[parkrun_event.name] = true
    }
  })

  return {
    "display_name": "Ukończonych lokalizacji",
    "help": "Liczba wszystkich różnych ukończonych lokalizacji.",
    "value": Object.keys(events_run).length
  }
}

// A percentage showing how many of the events you have run at are new events,
// i.e someone who never repeats an event is at 100%, and someone who never
// leaves home approaches 0%.
function generate_stat_tourist_quotient(parkrun_results) {
  // Find those parkrun events that have been completed
  var events_run = {}
  var tourist_quotient = "-"

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in events_run)) {
      events_run[parkrun_event.name] = true
    }
  })

  var event_count = Object.keys(events_run).length
  if (parkrun_results.length > 0) {
    tourist_quotient =  (100 * event_count / parkrun_results.length).toFixed(2) + "%"
  }

  return {
    "display_name": "Współczynnik turysty",
    "help": "Procent odwiedzonych lokalizacji parkrun, w których nie byłeś wcześniej. Jeśli nigdy nie powtórzysz lokalizacji będzie to 100%, jeśli nigdy nie wyjeżdżasz, wartość będzie zmierzać do 0%.",
    "value": tourist_quotient
  }
}

// Maximum number of consecutive different parkrun events
function generate_stat_longest_tourism_streak(parkrun_results) {
  var t_streak = 0
  let event_streak = []

  parkrun_results.forEach(function (parkrun_event, index) {

    // If we get a duplicate parkrun, chop off the start of the streak
    // up until the streak becomes unique again.
    //
    // e.g.
    // [1,2,3,4] - going to add [1]
    // will chop off the first element with splice(0,1)
    // [1,2,3,4,5,6] - going to add [3]
    // will chop off the first 3 elements
    if (event_streak.includes(parkrun_event.name)) {

      var f = 0
      var filteredElements = event_streak.some(function(item, index) {
         f = index; return item == parkrun_event.name
      })

      event_streak.splice(0,f+1)

    }

    // Add the new parkrun in - it will be unique in the list as we removed the
    // existing entries in the list above.
    event_streak.push(parkrun_event.name)
    t_streak = Math.max(t_streak, event_streak.length)

  })
  return {
    "display_name": "Najdłuższa turystyczna passa",
    "help": "Największa liczba ukończonych kolejno po sobie parkrun w różnych lokalizacjach.",
    "value": t_streak + " parkrun"
  }
}

function generate_stat_runs_this_year(parkrun_results) {
  // Find those parkrun events that have been completed
  var runs_this_year = 0
  var now = new Date()

  parkrun_results.forEach(function (parkrun_event) {
    if (parkrun_event.date_obj.getFullYear() == now.getFullYear()) {
      runs_this_year += 1
    }
  })

  return {
    "display_name": "Liczba parkrun ukończonych w tym roku",
    "help": "Liczba lokalizacji parkrun ukończonych w tym roku.",
    "value": runs_this_year
  }
}

// Total distance between parkruns that you have run - a measure of how much
// you have travelled to go to parkrun!
function generate_stat_total_distance_travelled(parkrun_results, geo_data) {
  var total_distance_travelled = 0
  var previous_event_location = undefined
  parkrun_results.forEach(function (parkrun_event) {

    // Work out how far the parkrunner has travelled (between consecutive events)
    if (geo_data.data.events[parkrun_event.name] !== undefined) {
      var event_location_info = geo_data.data.events[parkrun_event.name]
      // We need to know the previous event location to work out the distance
      // so we keep track of this separately to the previous event - in case we
      // don't know where someone inbetween is
      if (previous_event_location !== undefined) {
        // Compare the names of the parkruns and don't compute the distance if they
        // are the same - it should be fine without this, but we might get odd
        // small numbers being added if there are rounding errors
        if (parkrun_event.name != previous_event_location.name) {
          // Both event_location_info and previous_event_location have properties
          // of .lat and .lon, so we can pass them to this function
          // These distances can clock up fast if you regularly visit friends and
          // family in different parts of the country. A weekend in Manchester
          // from Winchester could easily add on another 250km for two consecutive
          // weeks
          total_distance_travelled += Math.round(calculate_great_circle_distance(event_location_info, previous_event_location))
        }
      }
      // Store where we were this week for next time
      previous_event_location = event_location_info
    }
  })

  return {
    "display_name": "Całkowity dystans pomiędzy lokalizacjami",
    "help": "Całkowity dystans przebyty pomiędzy wszystkimi odwiedzonymi lokalizacjami.",
    "value": total_distance_travelled + " km"
  }
}

// Count of the number of distinct countries you have visited
function generate_stat_total_countries_visited(parkrun_results, geo_data) {
  var parkrun_countries_visited = {}
  parkrun_results.forEach(function (parkrun_event) {

    // Work out how many countries have been visited
    if (geo_data.data.events[parkrun_event.name] !== undefined) {
      var event_location_info = geo_data.data.events[parkrun_event.name]
      if (event_location_info.country_name != 'unknown') {
        if (!(event_location_info.country_name in parkrun_countries_visited)) {
          parkrun_countries_visited[event_location_info.country_name] = true
        }
      }
    }
  })

  return {
    "display_name": "Odwiedzone kraje",
    "help": "Całkowita liczba krajów, w których ukończyłeś parkrun.",
    "value": Object.keys(parkrun_countries_visited).length
  }
}

function generate_stat_average_parkrun_location(parkrun_results, geo_data) {
  var lat_sum = 0
  var lon_sum = 0
  var count = 0

  parkrun_results.forEach(function (parkrun_event) {
    // Work out how far the parkrunner has travelled to this location
    if (parkrun_event.name in geo_data.data.events) {
      var event_location_info = geo_data.data.events[parkrun_event.name]
      if (event_location_info.lat && event_location_info.lon) {
        lat_sum += parseFloat(event_location_info.lat)
        lon_sum += parseFloat(event_location_info.lon)
        count += 1
      }
    }
  })

  var value = "Brak"
  var url_link = undefined
  if (count > 0) {
    var lat_av = (lat_sum/count).toFixed(5)
    var lon_av = (lon_sum/count).toFixed(5)
    value =  lat_av + ", " + lon_av
    // Provide a link to an openstreetmap with a marker in the location
    url_link = "https://www.openstreetmap.org/?mlat="+lat_av+"&mlon="+lon_av+"#map=9/"+lat_av+"/"+lon_av
  }

  return {
    "display_name": "Średnie współrzędne",
    "help": "Średnie współrzędne (długość i szerokość geograficzna) Twojej obecności na parkrun.",
    "value": value,
    "url": url_link
  }
}

// Furthest parkrun you have run away from your home parkrun
function generate_stat_furthest_travelled(parkrun_results, geo_data, home_parkrun) {
  furthest_travelled = {
    'parkrun_event': undefined,
    'distance': 0,
    'display_name': ''
  }
  parkrun_results.forEach(function (parkrun_event) {
    // Work out how far the parkrunner has travelled to this location
    var event_location_info = geo_data.data.events[parkrun_event.name]
    if (event_location_info !== undefined) {
      if (parkrun_event.name != home_parkrun.name) {
        var distance = Math.round(calculate_great_circle_distance(event_location_info, home_parkrun))
        if (distance > furthest_travelled.distance) {
          furthest_travelled.distance = distance
          furthest_travelled.parkrun_event = event_location_info
        }
      }
    }
  })

  if (furthest_travelled.parkrun_event !== undefined) {
    furthest_travelled.display_name = furthest_travelled.parkrun_event.name + ", " + furthest_travelled.parkrun_event.country_name
  }

  return {
    "display_name": "Najdalszy odwiedzony",
    "help": "Najdalej oddalona lokalizacja parkrun (liczone od Twojej lokalizacji macierzystej - zob. Opcje).",
    "value": furthest_travelled.display_name + " - "+ furthest_travelled.distance + " km od macierzystej lokalizacji"
  }
}

// Which is the closest parkrun you haven't done yet
function generate_stat_nearest_event_not_done_yet(parkrun_results, geo_data, home_parkrun_info) {
  // Find those parkrun events that have been completed
  var events_run = {}

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in events_run)) {
      events_run[parkrun_event.name] = true
    }
  })
  var event_distances = {}

  $.each(geo_data.data.events, function (event_name, event_info) {
    if (!(event_name in events_run)) {
      if ((event_info.status == 'Live' || event_info.status == 'unknown') && event_info.lat && event_info.lon) {
        event_distances[event_name] = calculate_great_circle_distance(event_info, home_parkrun_info)
      }
    }
  })

  // Sort the list of events not done by distance
  var sorted_events = Object.keys(event_distances).sort(function(a, b) {
      return event_distances[a] - event_distances[b]
  })

  var value = "Wszystkie parkruny ukończone!"

  if (sorted_events.length > 0) {
    var nendy_name = sorted_events[0]
    var nendy = geo_data.data.events[nendy_name]
    value = nendy.name + ", " + nendy.country_name+ " - " + Math.round(event_distances[nendy_name]) + " km od macierzystej lokalizacji"
  }

  return {
    "display_name": "Najbliższy nieukończony (NENDY)",
    "help": "Najbliższy od Twojej macierzystej lokalizacji nieukończony parkrun (NENDY - nearest event not done yet).",
    "value": value
  }
}

// How many times has your name appeared on the volunteer roster (note, not the
// same as volunteer club progress, as this takes into account multiple roles
// per week)
function generate_stat_total_volunteer_roles(volunteer_data) {
  var total_volunteer_roles = 0
  $.each(volunteer_data, function (role, count) {
    total_volunteer_roles += count
  })
  return {
    "display_name": "Liczba wolontariatów",
    "help": "Całkowita liczba razy ile Twoje imię i nazwisko pojawiło się w harmonogramie (wliczając w to wielokrotne role jednego tygodnia).",
    "value": total_volunteer_roles
  }
}

// How many of the different volunteer roles have you done
function generate_stat_total_distinct_volunteer_roles(volunteer_data) {
  return {
    "display_name": "Całkowita liczba ról wolontariackich",
    "help": "Liczba różnych pełnionych ról wolontariackich.",
    "value": Object.keys(volunteer_data).length
  }
}


function generate_stats(data) {

  stats = {}

  // Stats that only need the list of parkruns
  if (data.info.has_parkrun_results) {
    stats['total_runs'] = generate_stat_total_runs(data.parkrun_results)
    stats['events_run'] = generate_stat_events_run(data.parkrun_results)
    stats['most_runs_in_a_year'] = generate_stat_most_runs_in_a_year(data.parkrun_results)
    stats['runs_this_year'] = generate_stat_runs_this_year(data.parkrun_results)
    stats['parkrun_birthday'] = generate_stat_parkrun_birthday(data.parkrun_results)
    stats['years_parkrunning'] = generate_stat_years_parkrunning(data.parkrun_results)
    stats['total_pbs'] = generate_stat_total_pbs(data.parkrun_results)
    stats['longest_pb_streak'] = generate_stat_longest_pb_streak(data.parkrun_results)
    stats['p_index'] = generate_stat_p_index(data.parkrun_results)
    stats['wilson_index'] = generate_stat_wilson_index(data.parkrun_results)
    stats['finish_index'] = generate_stat_finish_index(data.parkrun_results)
    stats['gossit_index'] = generate_stat_gossit_index(data.parkrun_results)
    stats['tourist_quotient'] = generate_stat_tourist_quotient(data.parkrun_results)
    stats['tourism_streak'] = generate_stat_longest_tourism_streak(data.parkrun_results)
    stats['total_distance_ran'] = generate_stat_total_distance_ran(data.parkrun_results)
  }

  // Stats that need a list of parkruns, and additional geo data to determine where they are
  if (data.info.has_parkrun_results && data.info.has_geo_data) {
    stats['total_distance_travelled'] = generate_stat_total_distance_travelled(data.parkrun_results, data.geo_data)
    stats['total_countries_visited'] = generate_stat_total_countries_visited(data.parkrun_results, data.geo_data)
    stats['average_parkrun_location'] = generate_stat_average_parkrun_location(data.parkrun_results, data.geo_data)
  }

  // Stats that need the user data available, and we are on their page (i.e. has
  // to be the person who has installed the plugin)
  if (data.info.has_parkrun_results && data.info.has_geo_data && data.info.is_our_page && data.info.has_home_parkrun) {
    stats['furthest_travelled'] = generate_stat_furthest_travelled(data.parkrun_results, data.geo_data, data.user_data.home_parkrun_info)
    stats['nearest_event_not_done_yet'] = generate_stat_nearest_event_not_done_yet(data.parkrun_results, data.geo_data, data.user_data.home_parkrun_info)
  }

  // Stats based off the volunteer data
  if (data.info.has_volunteer_data) {
    stats['total_volunteer_roles'] = generate_stat_total_volunteer_roles(data.volunteer_data)
    stats['total_distinct_volunteer_roles'] = generate_stat_total_distinct_volunteer_roles(data.volunteer_data)
    stats['v_index'] = generate_stat_v_index(data.volunteer_data)
  }

  return stats
}

function get_initial_letter(event_name) {
  return event_name[0].toLowerCase()
}


function get_flag_image_src(country) {
  // Mapping countries to flag image files
  var flag_map = {
      "New Zealand": "nz",
      "Australia": "au",
      "Denmark": "dk",
      "Finland": "fi",
      "France": "fr",
      "Germany": "de",
      "Iceland": "is",
      "Ireland": "ie",
      "Italy": "it",
      "Japan": "jp",
      "Malaysia": "my",
      "Canada": "ca",
      "Namibia": "na",
      "Norway": "no",
      "Poland": "pl",
      "Russia": "ru",
      "Singapore": "sg",
      "South Africa": "za",
      "Swaziland": "sz",
      "Sweden": "se",
      "UK": "gb",
      "USA": "us",
      "Zimbabwe": "zw",
      "World": "world"
  }

  var flag_src = browser.extension.getURL("/images/flags/flag-unknown.png")

  if (country in flag_map) {
    flag_src = browser.extension.getURL("/images/flags/"+flag_map[country]+".png")
  }

  return flag_src
}

function generate_global_tourism_data(parkrun_results, geo_data) {
    // Generate essentially the same results as the regionnaire challenge all over again
    // console.log("generate_global_tourism_data()")
    var global_tourism = []

    regions = geo_data.data.regions
    events_completed_map = group_results_by_event(parkrun_results)
    sorted_region_heirachy = calculate_child_regions(regions, events_completed_map, "World")

    sorted_region_heirachy.child_regions.sort().forEach(function(top_level_country) {
        // Skip the world
        if (top_level_country.name == "World") {
            return
        }

        var country_info = {
            "name": top_level_country.name,
            "visited": false,
            "first_visited": top_level_country.first_ran_on,
            "icon": get_flag_image_src(top_level_country.name)
        }

        var child_events = find_region_child_events(top_level_country)

        if (top_level_country.child_events_completed_count > 0) {
            country_info["visited"] = true
        }
        global_tourism.push(country_info)
    })
    return global_tourism
}

function find_region_child_events(region, events=[]) {
    // Add the direct child events of this region
    region.child_events.forEach(function (region_event) {
        events.push(region_event)
    })
    // Further query all the child regions of this region
    region.child_regions.forEach(function (child_region) {
        find_region_child_events(child_region, events)
    })
    return events
}

function create_data_object(params, category) {
    var o = {
        "shortname": params.shortname,
        "name": params.name,
        "help": params.help,
        "start_time": new Date(),
        "complete": false,
        "completed_on": null,
        "subparts": [],
        "subparts_completed_count": 0,
        "subparts_detail": [],
        "badge_icon": category+"-"+params.shortname,
        // Which events have contributed to this challenge?
        // - a list of names
        "completed_qualifying_events": {},
        // Which are the closest events that could contribute to this challenge
        // in order to complete it
        // - a list of names
        "nearest_qualifying_events": {},
        // All of the qualifying events for this challenge
        // - a list of names
        "all_qualifying_events": {},
        // Whether this challenge has something you can map
        "has_map": false,
        // Where the reference home parkrun is, if available
        "home_parkrun": undefined
    }
    return o
}

function update_data_object(o) {
    o['stop_time'] = new Date()
    o['duration'] = o.stop_time - o.start_time
    o['subparts_count'] = o.subparts.length
    // console.log("Completed data for " + o.shortname + " in " + o['duration'] + "ms")
    return o
}

// Group all parkruns completed by event
function group_results_by_event(parkrun_results) {

    events = {}
    parkrun_results.forEach(function (parkrun_event) {
        // Create an empty list if we haven"t seen this parkrun before
        if (!(parkrun_event.name in events)) {
            events[parkrun_event.name] = []
        }
        // Append this instance to the appropriate event list
        events[parkrun_event.name].push(parkrun_event)
    });

    return events
}

function event_contains_word(event_name, word) {
  if (event_name.toLowerCase().indexOf(word) != -1) {
    return true
  }
}

function group_global_events_by_containing_word(geo_data, words) {

  var events = {}

  $.each(words, function(index, word) {
    events[word] = []
  })

  $.each(geo_data.data.events, function (event_name, event_info) {
    if (event_info.status == 'Live' || event_info.status == 'unknown') {
      $.each(words, function(index, word) {
        if (event_contains_word(event_name, word)) {
          events[word].push(event_info)
        }
      })
    }
  })

  return events

}

function group_global_events_by_initial_letter(geo_data) {

  var events = {}

  $.each(geo_data.data.events, function (event_name, event_info) {
    if (event_info.status == 'Live' || event_info.status == 'unknown') {
      event_letter = get_initial_letter(event_info["shortname"])
      if (events[event_letter] === undefined) {
        events[event_letter] = []
      }
      events[event_letter].push(event_info)
    }
  })

  return events
}


function sort_events_by_distance(events, from_location) {

  //console.log("sort_events_by_distance()")
  var sorted_events = []

  // If we have a unusable from location, return straight away
  if (from_location == undefined || from_location.lat == undefined || from_location.lon == undefined) {
    return sorted_events
  }

  // Only process those events with locations - they should all have locations,
  // but if they don't, there isn't a lot we can do
  events_with_location_info = []
  $.each(events, function(event_name, event_info) {
    if (event_info.lat && event_info.lon) {
      events_with_location_info.push({
        "name": event_name,
        "distance": calculate_great_circle_distance(event_info, from_location),
        "lat": event_info.lat,
        "lon": event_info.lon
      })
    }
  })

  sorted_events = events_with_location_info.sort(function(event_a, event_b) {
      return event_a.distance - event_b.distance
  })

  // console.log(sorted_events)
  return sorted_events
}

function sort_grouped_events_by_distance(grouped_events, from_location) {
  var sorted_events = {}

  // If we have a unusable from location, return straight away
  if (from_location == undefined || from_location.lat == undefined || from_location.lon == undefined) {
    return sorted_events
  }

  $.each(grouped_events, function (group, event_list) {

    // Only process those events with locations - they should all have locations,
    // but if they don't, there isn't a lot we can do
    events_with_location_info = []
    $.each(event_list, function(index, event) {
      if (event.lat && event.lon) {
        events_with_location_info.push(event)
      }
    })

    // Sort the list of places with locations by their distance from the
    // from_location provided
    sorted_events[group] = events_with_location_info.sort(function(event_a, event_b) {
        return calculate_great_circle_distance(event_a, from_location) - calculate_great_circle_distance(event_b, from_location)
    })
  })

  return sorted_events

}

function get_parkrun_event_details(data, parkrun_name) {
  // Standard information
  var parkrun_event_details = {
    "name": parkrun_name
  }
  // Everything else needs geo data
  if (data.info.has_geo_data) {
    // Add the location in if we have it
    if (parkrun_name in data.geo_data.data.events) {
      geo_event = data.geo_data.data.events[parkrun_name]
      if (geo_event.lat && geo_event.lon) {
        parkrun_event_details.lat = geo_event.lat
        parkrun_event_details.lon = geo_event.lon
        // Now we have the location, we can also add in the distance to our
        // home parkrun, if we have set that, and we are looking at our page
        if (data.info.is_our_page && data.info.has_home_parkrun) {
          parkrun_event_details.distance = calculate_great_circle_distance(geo_event, get_home_parkrun(data))
        }
      }
      if (geo_event.local_url && geo_event.shortname) {
        parkrun_event_details.event_url = geo_event.local_url + '/' + geo_event.shortname
      }
    }
  }
  return parkrun_event_details
}

function challenge_start_letters(data, params) {

  // Find the data we are interested in
  parkrun_results = data.parkrun_results
  geo_data = data.geo_data
  user_data = data.user_data
  home_parkrun = undefined
  if (user_data) {
    home_parkrun = user_data.home_parkrun_info
  }

    var letters = params.data

    var o = create_data_object(params, "runner")
    o.has_map = true
// console.log(data.info.has_custom_word)
//     if (data.info.has_custom_word) {
//       o.custom_word = data.user_data.get_custom_word
//       console.log(o.custom_word)
//     }

    // Add all the subparts to the list
    for (i=0; i<letters.length; i++) {
        // Store each one as the parts we need to do
        o.subparts.push(letters[i])
        // Create placeholders for each contributing result
        o.subparts_detail.push(null)
    }

    checked_parkruns = []

    parkrun_results.forEach(function (parkrun_event) {

        if (!(checked_parkruns.includes(parkrun_event.name))) {
            initial_letter = parkrun_event.name[0].toLowerCase()
            // Skips those parkruns that aren't going to match at all
            if (o.subparts.includes(initial_letter)) {
                // Loop through all the letters we are looking for
                for (i=0; i<o.subparts.length; i++) {
                    // Find a matching subpart that hasn't yet been filled in
                    if (o.subparts_detail[i] == null && o.subparts[i] == initial_letter) {
                        // Add the event
                        p = Object.create(parkrun_event)
                        p.subpart = initial_letter
                        p.info = p.date
                        o.subparts_detail[i] = p
                        o.subparts_completed_count += 1
                        if (!(parkrun_event.name in o.completed_qualifying_events)) {
                          o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
                        }

                        if (o.subparts.length == o.subparts_completed_count) {
                            o.complete = true
                            o.completed_on = p.date
                        }
                        // Get out of the for loop
                        break
                    }
                }
            }

            // Lets not process this parkrun again, even if we have run it more than once
            checked_parkruns.push(parkrun_event.name)
        }
    })

    // Group and sort the qualifying events
    grouped_events = {}
    sorted_grouped_events = {}
    if (geo_data) {
      grouped_events = group_global_events_by_initial_letter(geo_data)
      if (home_parkrun) {
        sorted_grouped_events = sort_grouped_events_by_distance(grouped_events, home_parkrun)
      }
    }

    // Add in all the missing ones
    for (i=0; i< o.subparts.length; i++) {
        if (o.subparts_detail[i] == null) {
            o.subparts_detail[i] = {
                "subpart": o.subparts[i],
                "info": "-"
            }


            // if (grouped_events !== undefined) {
            // Add those events for this letter
            if (o.subparts[i] in grouped_events) {
              $.each(grouped_events[o.subparts[i]], function (index, event) {
                // Don't add them if they are already there
                if (!(event.name in o.all_qualifying_events)) {
                  details = get_parkrun_event_details(data, event.name)
                  if (has_lat_lon(details)) {
                    o.all_qualifying_events[event.name] = details
                  }
                }
              })
            }
            // }

            // If this is our page (i.e. the athlete id in our profile matches
            // that of this page), then we can try and work out which are closest
            if (data.info.is_our_page) {
              // console.log(sorted_grouped_events)
              // if (sorted_grouped_events !== undefined) {
              if (o.subparts[i] in sorted_grouped_events) {
                // Add the first on that we haven't already added
                $.each(sorted_grouped_events[o.subparts[i]], function(index, event) {
                  // Only add it, and break out of the loop, if it is new
                  if (!(event.name in o.nearest_qualifying_events)) {
                    o.nearest_qualifying_events[event.name] = get_parkrun_event_details(data, event.name)
                    // Break out
                    return false
                  }
                })
              }
            }
            // }
        }
    }

    // console.log(o)

    // Return an object representing this challenge
    return update_data_object(o)
}

function challenge_compass_club_regions(data, challenge_data) {
  $.each(data.geo_data.data.countries, function (country_name, country_info) {
    var country = {}
    //limiting to Poland (id=23) only
    if (data.geo_data.data.regions[country_name].id=="23"){
      if (data.geo_data.data.regions[country_name].child_event_recursive_names.length > 0) {
        $.each(data.geo_data.data.regions[country_name].child_event_recursive_names, function(index, event_name) {
          var event_info = data.geo_data.data.events[event_name]
          if (country['north'] === undefined || parseFloat(event_info.lat) > parseFloat(country['north'].lat))
            country['north'] = event_info
          if (country['south'] === undefined || parseFloat(event_info.lat) < parseFloat(country['south'].lat))
            country['south'] = event_info
          if (country['east'] === undefined || parseFloat(event_info.lon) > parseFloat(country['east'].lon))
            country['east'] = event_info
          if (country['west'] === undefined || parseFloat(event_info.lon) < parseFloat(country['west'].lon))
            country['west'] = event_info
        })

        //console.log(country_name + ": north - " + country['north'].name + ", east - " + country['east'].name + ", south - " + country['south'].name + ", west - " + country['west'].name)
        var challenge = challenge_parkruns(data, {
            "shortname": "compass-club",
            "name": "Klub Kompasu",
            "data": [country['north'].name, country['east'].name, country['south'].name, country['west'].name],
            "help": "Ukończ parkrun w najbardziej wysuniętych w czterech stronach świata lokalizacjach Polski."
        })
        challenge['badge_icon'] = 'runner-compass-club'
        challenge_data.push(challenge)
    }}
  })
}

function challenge_words(data, params) {

  var parkrun_results = data.parkrun_results
    var word_array = params.data

    var o = create_data_object(params, "runner")
    o.has_map = true

    // Add all the subparts to the list
    word_array.forEach(function (word) {
        // Store each one as the parts we need to do
        o.subparts.push(word.toLowerCase())
        // Create placeholders for each contributing result
        o.subparts_detail.push(null)
    })

    // Group and sort the qualifying events
    // If we don't have the data, then the objects will be empty, and the checking
    // code will iterate over an empty objection
    grouped_events = {}
    sorted_grouped_events = {}
    if (data.info.has_geo_data) {
      grouped_events = group_global_events_by_containing_word(geo_data, o.subparts)
      if (data.info.has_home_parkrun && data.info.is_our_page) {
        sorted_grouped_events = sort_grouped_events_by_distance(grouped_events, data.user_data.home_parkrun_info)
      }
    }

    checked_parkruns = []

    parkrun_results.forEach(function (parkrun_event) {

        if (!(checked_parkruns.includes(parkrun_event.name))) {
            // Loop through all the words we are looking for
            for (i=0; i<o.subparts.length; i++) {
                // Find a matching subpart that hasn't yet been filled in
                if (o.subparts_detail[i] == null && parkrun_event.name.toLowerCase().indexOf(o.subparts[i]) != -1) {
                    // Add the event
                    p = Object.create(parkrun_event)
                    p.subpart = o.subparts[i]
                    p.info = p.date
                    o.subparts_detail[i] = p
                    o.subparts_completed_count += 1

                    if (!(parkrun_event.name in o.completed_qualifying_events)) {
                      o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
                    }

                    if (o.subparts.length == o.subparts_completed_count) {
                        o.complete = true
                        o.completed_on = p.date
                    }
                    // Get out of the for loop
                    break
                }
            }


            // Lets not process this parkrun again, even if we have run it more than once
            checked_parkruns.push(parkrun_event.name)
        }
    })

    // Add in all the missing ones
    for (i=0; i< o.subparts.length; i++) {
        if (o.subparts_detail[i] == null) {
            o.subparts_detail[i] = {
                "subpart": o.subparts[i],
                "info": "-"
            }

            // If this is our page, and hence we know where the home parkrun is,
            // find out the closest event to complete this sub-part
            if (o.subparts[i] in sorted_grouped_events) {
              $.each(sorted_grouped_events[o.subparts[i]], function(index, event) {
                if (!(event.name in o.nearest_qualifying_events)) {
                  o.nearest_qualifying_events[event.name] = get_parkrun_event_details(data, event.name)
                  // Break out of the .each loop after we have found the closest
                  return false
                }
              })
            }

            if (o.subparts[i] in grouped_events) {
              // If we haven't added this event to the closest collection, then add it
              // to the all collection
              $.each(grouped_events[o.subparts[i]], function(index, event) {
                if (!(event.name in o.nearest_qualifying_events) && !(event.name in o.all_qualifying_events)) {
                  o.all_qualifying_events[event.name] = get_parkrun_event_details(data, event.name)
                }
              })
            }
        }
    }

    // Return an object representing this challenge
    //console.log(o)
    return update_data_object(o)
}

function challenge_parkruns(data, params) {

  var parkrun_results = data.parkrun_results
    var parkrun_array = params.data

    var o = create_data_object(params, "runner")
    o.has_map = true

    // Add all the subparts to the list
    parkrun_array.forEach(function (parkrun_name) {
        // Store each one as the parts we need to do
        o.subparts.push(parkrun_name)//.toLowerCase())
        // Create placeholders for each contributing result
        o.subparts_detail.push(null)
    })

    events = group_results_by_event(parkrun_results)

    Object.keys(events).forEach(function (parkrun_name) {

        if (o.subparts.includes(parkrun_name)) {
            subparts_index = o.subparts.indexOf(parkrun_name)

            p = Object.create(events[parkrun_name][0])
            p.subpart = o.subparts[subparts_index]
            p.info = p.date
            o.subparts_detail[subparts_index] = p
            o.subparts_completed_count += 1
            if (!(parkrun_name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[parkrun_name] = get_parkrun_event_details(data, parkrun_name)
            }

            if (o.subparts.length == o.subparts_completed_count) {
                o.complete = true
                o.completed_on = p.date
            }
        }
    })

    // Add in all the missing ones
    for (i=0; i< o.subparts.length; i++) {
        if (o.subparts_detail[i] == null) {
            o.subparts_detail[i] = {
                "subpart": o.subparts[i],
                "info": "-"
            }
            // Add all of the missing events to the 'all' collection, as it doesn't
            // really make a lot of sense for them to be in the 'closest' set,
            // as they are all the closest
            if (data.info.has_geo_data) {
              o.all_qualifying_events[o.subparts[i]] = get_parkrun_event_details(data, o.subparts[i])
            }
        }
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

// Complete x different parkruns (20 and 100 are standard)
function challenge_tourist(data, params) {

    var parkrun_results = data.parkrun_results

    var count = params.data

    var o = create_data_object(params, "runner")
    o.has_map = true

    distinct_parkruns_completed = {}

    // Add all the subparts to the list
    for (i=0; i<count; i++) {
        o.subparts.push("parkrun_"+i)
    }

    $.each(data.parkrun_results, function(index, parkrun_event) {
    // parkrun_results.forEach(function (parkrun_event) {
        var completed_so_far = Object.keys(distinct_parkruns_completed).length
        // Ony do the first 20
        if (completed_so_far < o.subparts.length) {
            if (!(parkrun_event.name in distinct_parkruns_completed)) {
                o.subparts_completed_count += 1
                // Add it in for the next complete subpart
                p = Object.create(parkrun_event)
                p.subpart = o.subparts_completed_count
                p.info = parkrun_event.date
                o.subparts_detail.push(p)

                // Add to the events done list, so that we can map them
                if (!(parkrun_event.name in o.completed_qualifying_events)) {
                  o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
                }

                distinct_parkruns_completed[parkrun_event.name] = true
            }
            if (o.subparts_completed_count == o.subparts.length) {
                o.complete = true
                o.completed_on = parkrun_event.date
            }
        }

    });

    // If we haven't completed this challenge, try and find out what possible
    // events would allow us to complete it.
    if (o.complete == false) {
      if (data.info.has_geo_data) {
        if (data.info.has_home_parkrun && data.info.is_our_page) {
          sorted_events = sort_events_by_distance(data.geo_data.data.events, get_home_parkrun(data))
          $.each(sorted_events, function(index, event) {
            // Only consider this if we haven't done it
            if (!(event.name in o.completed_qualifying_events)) {
              // If we still need a top-up to get to completion, add it to nearest events
              if (Object.keys(o.nearest_qualifying_events).length + Object.keys(o.completed_qualifying_events).length < o.subparts.length) {
                if (!(event.name in o.nearest_qualifying_events)) {
                  o.nearest_qualifying_events[event.name] = get_parkrun_event_details(data, event.name)
                }
              }
            }
          })
        }
        // Add any other qualifying events
        $.each(data.geo_data.data.events, function(index, event) {
          if (!(event.name in o.completed_qualifying_events) && !(event.name in o.nearest_qualifying_events)) {
            if (!(event.name in o.all_qualifying_events)) {
              o.all_qualifying_events[event.name] = get_parkrun_event_details(data, event.name)
            }
          }
        })
      }
    }

    // Work out if it is possible to have a partial completion
    // if (params.shortname == "cowell-club" && o.complete == false) {
    //     if (o.subparts_completed_count >= 75) {
    //         o.partial_completion = true
    //         o.partial_completion_name = "Three-Quarter Cowell"
    //         o.partial_completion_badge_icon = "runner-three-quarter-cowell-club"
    //     } else if (o.subparts_completed_count >= 50) {
    //         o.partial_completion = true
    //         o.partial_completion_name = "Half Cowell"
    //         o.partial_completion_badge_icon = "runner-half-cowell-club"
    //     } else if (o.subparts_completed_count >= 25) {
    //         o.partial_completion = true
    //         o.partial_completion_name = "Quarter Cowell"
    //         o.partial_completion_badge_icon = "runner-quarter-cowell-club"
    //     }
    // }

    // Return an object representing this challenge
    return update_data_object(o)
}

// Just return true for now
// Return true if the athlete id for this page match what is stored in the user data
function is_our_page(data) {
  return has_user_data_athlete_id(data) && has_this_athlete_id(data) && get_user_data_athlete_id(data) == get_this_athlete_id(data)
}

function has_user_data(data) {
  return data.user_data !== undefined
}

function get_user_data(data) {
  return data.user_data
}

function has_user_data_athlete_id(data) {
  return has_it = false
  if (has_user_data(data)) {
    if (get_user_data(data).athlete_number !== undefined) {
      has_it = true
    }
  }
  return has_it
}

function get_user_data_athlete_id(data) {
  return get_user_data(data).athlete_number
}

function has_this_athlete_id(data) {
  return data.athlete_id !== undefined
}

function get_this_athlete_id(data) {
  return data.athlete_id
}

// Return true if there is valid geo data available
function has_geo_data(data) {
  geo_data = get_geo_data(data)
  return geo_data !== undefined
}

function get_geo_data(data) {
  return data.geo_data
}

// Return true if there is a home parkrun set
function has_home_parkrun(data) {
  home_parkrun = get_home_parkrun(data)
  return home_parkrun !== undefined
}

function get_home_parkrun(data) {
  if (data.user_data !== undefined) {
    return data.user_data.home_parkrun_info
  }
  return undefined
}

function has_lat_lon(details) {
  return details.lat !== undefined && details.lon !== undefined
}

function challenge_stopwatch_bingo(data, params) {

  var parkrun_results = data.parkrun_results

    var o = create_data_object(params, "runner")

    // Add all the subparts to the list
    for (i=0; i<60; i++) {
        number_string = i.toString()
        if (i < 10) {
            number_string = "0"+number_string
        }
        o.subparts.push(number_string)
        o.subparts_detail[number_string] = null
    }

    parkrun_results.forEach(function (parkrun_event) {
        // Take the last 2 characters of the time
        seconds = parkrun_event.time.substr(parkrun_event.time.length - 2)
        // Convert them to a number to get the index in our array
        subparts_detail_index = parseInt(seconds)
        if (o.subparts_detail[subparts_detail_index] == null) {
            o.subparts_detail[subparts_detail_index] = Object.create(parkrun_event)
            o.subparts_detail[subparts_detail_index].subpart = seconds
            o.subparts_detail[subparts_detail_index].info = parkrun_event.time
            o.subparts_completed_count += 1

            if (!(parkrun_event.name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
            }

            if (o.subparts.length == o.subparts_completed_count) {
                o.complete = true
                o.completed_on = parkrun_event.date
            }
        }

    });

    // Add in all the missing ones
    for (i=0; i< o.subparts_detail.length; i++) {
        if (o.subparts_detail[i] == null) {
            o.subparts_detail[i] = {
                "subpart": o.subparts[i],
                "info": "-"
            }
        }
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

function challenge_finish_position_bingo(data, params) {

  var parkrun_results = data.parkrun_results
  var o = create_data_object(params, "runner")

  // Add all the subparts to the list
  for (i=1; i<=100; i++) {
      number_string = i.toString()
      o.subparts.push(number_string)
      o.subparts_detail[number_string] = null
  }

  parkrun_results.forEach(function (parkrun_event) {
      // Convert finish position to a number to get the index in our array
      subparts_detail_index = parseInt(parkrun_event.position) % 100
  if (subparts_detail_index == 0)
    subparts_detail_index = 100
  if (o.subparts_detail[subparts_detail_index] == null) {
    o.subparts_detail[subparts_detail_index] = Object.create(parkrun_event)
    o.subparts_detail[subparts_detail_index].subpart = subparts_detail_index
    o.subparts_detail[subparts_detail_index].name = 1
    o.subparts_detail[subparts_detail_index].info = parkrun_event.date
    o.subparts_completed_count += 1

    if (!(parkrun_event.name in o.completed_qualifying_events)) {
      o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
    }

    if (o.subparts.length == o.subparts_completed_count) {
      o.complete = true
      o.completed_on = parkrun_event.date
    }
  }
  else {
    o.subparts_detail[subparts_detail_index].name++
  }
  });

  // Add in all the missing ones
  for (i=1; i<=100; i++) {
      if (o.subparts_detail[i] == null) {
          o.subparts_detail[i] = {
              "subpart": i,
              "info": "-",
      "name": "-"
          }
      }
  else {
    o.subparts_detail[i].name = o.subparts_detail[i].name.toString() + "x"
  }
  }

  // Return an object representing this challenge
  return update_data_object(o)
}

// Complete 100 parkruns at the same venue
function challenge_single_parkrun_count(data, params) {

  var parkrun_results = data.parkrun_results

    var count = params.data

    var o = create_data_object(params, "runner")
    o.subparts = ["1"]

    parkruns_completed = {}
    max_count = 0
    max_parkrun = null

    parkrun_results.forEach(function (parkrun_event) {
        if (!(parkrun_event.name in parkruns_completed)) {
            parkruns_completed[parkrun_event.name] = {
                "name": parkrun_event.name,
                "count": 0,
                "completed": false,
                "completed_at": null,
                "subpart": count+"+"
            }
        }
        parkruns_completed[parkrun_event.name].count += 1
        if (parkruns_completed[parkrun_event.name].count > max_count) {
            max_parkrun = Object.create(parkruns_completed[parkrun_event.name])
            max_count = parkruns_completed[parkrun_event.name].count
        }
        // Mark as complete if we've hit the magic 100 at this parkrun,
        // and store some good bits of data
        if (parkruns_completed[parkrun_event.name].count == count) {
            o.complete = true
            o.subparts_completed_count += 1
            parkruns_completed[parkrun_event.name].completed = true
            parkruns_completed[parkrun_event.name].completed_at = parkrun_event.date
            if (o.completed_on == null) {
                o.completed_on = parkrun_event.date
            }
        }
    });

    if (o.complete) {
        // Return all parkrun events where the limit has been reached
        Object.keys(parkruns_completed).forEach(function (parkrun) {
            if (parkruns_completed[parkrun].completed) {
                p = parkruns_completed[parkrun]
                p.info = p.count
                o.subparts_detail.push(p)
                if (!(parkrun in o.completed_qualifying_events)) {
                  o.completed_qualifying_events[parkrun] = get_parkrun_event_details(data, parkrun)
                }
            }
        })
    } else {
        if (max_parkrun !== null) {
            // If it isn't complete, give the biggest one so far as detail info
            max_parkrun.info = max_parkrun.count
            o.subparts_detail.push(max_parkrun)
        }
    }


    // Return an object representing this challenge
    return update_data_object(o)
}

function challenge_metronome(data, params) {
  var parkrun_results = data.parkrun_results
  var o = create_data_object(params, "runner")
  o.complete = false
  o.subparts = ["1"]
  o.summary_text = "0"
  var timeCounts = {}
  parkrun_results.forEach(function (parkrun_event) {
    if (o.subparts_detail.length == 0) {
          var timeCount = timeCounts[parkrun_event.time]
          if (timeCount === undefined)
              timeCounts[parkrun_event.time] = 1
          else
              timeCounts[parkrun_event.time] = timeCount + 1

      if (timeCount == 9) { // now 10
              o.subparts_detail.push({
                  "name": parkrun_event.time,
                  "date": parkrun_event.date,
                  "info": parkrun_event.date,
                  "subpart": "10x"
              })
              o.subparts_completed_count = 1
              o.summary_text = "1"
              o.complete = true
              o.completed_on = parkrun_event.date
          }
    }
  })

  var highestCount = 0
  var highestTime = ""
  if (!o.complete) {
    for (var time in timeCounts) {
      if (timeCounts[time] > highestCount) {
        highestCount = timeCounts[time]
        highestTime = time
      }
    }
  }

  if (o.subparts_detail.length == 0) {
      o.subparts_detail.push({
          "name": highestTime,
          "subpart": highestCount + "x",
          "date": "-",
          "info": "-"
      })
  }

  return update_data_object(o)
}

function challenge_on_dates(data, params) {
  var parkrun_results = data.parkrun_results
  var o = create_data_object(params, "runner")

  // This challenge looks to see that parkruns have been done on specific dates,
  // therefore we are passed in a set of days/months to match. It's not fair to
  // pass in a specific year as well, as no-one can work towards that, so we only
  // allow month & day combinations. E.g. for Christmas, or to run in every month
  // of the year, or perhaps even every date of the year, or Feb 29th or something -
  // all of these should work
  var challenge_dates = params.data // dates should be an array

  // For each part in the dates to match, make an empty array of matching
  // parkrun events.
  o.subparts = []
  if (challenge_dates !== undefined) {
    $.each(challenge_dates, function (index, this_challenge_date) {
      o.subparts[index] = []
    })
    if (challenge_dates.length > 1) {
      // If there is more than one subpart, then create the parts to show in the
      // ui
      $.each(challenge_dates, function (index, this_challenge_date) {

        subpart_name = this_challenge_date.month+"/"+this_challenge_date.day
        if (this_challenge_date.month !== undefined && this_challenge_date.day === undefined) {
          subpart_name = 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień'.split('_')[this_challenge_date.month]
        } else if (this_challenge_date.month === undefined && this_challenge_date.day !== undefined) {
          subpart_name = this_challenge_date.day+" dzień miesiąca"
        }

        o.subparts_detail[index] = {
            "subpart": subpart_name
        }

      })
    }
  }

  o.summary_text = "0"

  // We might be able to put these on a map, but not right now
  o.has_map = false

  parkrun_results.forEach(function (parkrun_event) {

    if (challenge_dates !== undefined) {
      $.each(challenge_dates, function (index, this_challenge_date) {
        // Default to not matching
        var applicable_month = false
        var applicable_day = false

        // Check if the month matches (getMonth() - 0-11)
        if (this_challenge_date.month !== undefined ) {
          if (this_challenge_date.month == parkrun_event.date_obj.getMonth()) {
            // console.log("Event matches the month for : " + JSON.stringify(this_challenge_date))
            applicable_month = true
          }
        } else {
          // There is no month to match, so it's a wildcard and always matches
          applicable_month = true
        }

        // Check if the day of the month matches (getDate() - 1-31)
        if (this_challenge_date.day !== undefined ) {
          if (this_challenge_date.day == parkrun_event.date_obj.getDate()) {
            // console.log("Event matches the day for : " + JSON.stringify(this_challenge_date))
            applicable_day = true
          }
        } else {
          // There is no day to match, so it's a wildcard and always matches
          applicable_day = true
        }

        if (applicable_day && applicable_month) {
          //console.log("Event matches both day & month for : " + JSON.stringify(this_challenge_date) + " - " + JSON.stringify(parkrun_event))
          // Append this completed parkrun to the correct subpart list
          o.subparts[index].push(parkrun_event)
        }

      })
    }

  })

  // Work out how many times we have completed the challenge by looking at
  // how many events have been added for each subpart
  var completion_count = undefined;
  //console.log(o.subparts)
  o.subparts.forEach(function(events_for_this_date) {
    if (completion_count === undefined) {
      completion_count = events_for_this_date.length
    } else {
      completion_count = Math.min(completion_count, events_for_this_date.length)
    }
  })

  if (completion_count > 0) {
    o.complete = true
  }

  console.log("Wyzwanie ukończone " + completion_count +" razy.")
  o.subparts_completed_count = completion_count

  // If there is only one date, we can reasonably list the date that the parkrunner
  // achieved this challenge. If it is a string of dates, it's nearly impossible
  // to do that in a sensible manner
  if (o.subparts.length == 1) {
    o.subparts[0].forEach(function(parkrun_event) {
      o.subparts_detail.push({
          "name": parkrun_event.name,
          "date": parkrun_event.date,
          "info": parkrun_event.date,
          "subpart": o.subparts_detail.length + 1
      })
    })
  } else {
    // If there is more than one date, then lets list them all
    $.each(challenge_dates, function(index, matching_date) {

      if (o.subparts[index].length > 0) {
        o.subparts_detail[index].name = "x"+o.subparts[index].length
        o.subparts_detail[index].date = o.subparts[index][0].date
        o.subparts_detail[index].info = o.subparts[index][0].date
      }
    })
  }
  // If there are no subparts listed, make it a dash
  if (o.subparts_detail.length == 0) {
      o.subparts_detail.push({
          "subpart": o.subparts_detail.length + 1,
          "info": "-"
      })
  }

  // Change the summary to indicate number of times completed
  if (o.subparts_completed_count > 0) {
      o.summary_text = "x"+o.subparts_completed_count
  }

  // Return an object representing this challenge
  return update_data_object(o)

}

function challenge_nyd_double(data, params) {

  var parkrun_results = data.parkrun_results
    var o = create_data_object(params, "runner")
    o.subparts = ["1"]
    o.summary_text = "0"

    o.has_map = true
    if (has_home_parkrun(data) && is_our_page(data)) {
      o.home_parkrun = get_home_parkrun(data)
    }

    var previous_parkrun = null

    parkrun_results.forEach(function (parkrun_event) {
        // Take the first 6 characters of the date to get the '01/01/' part
        day_month = parkrun_event.date.substr(0, 6)

        if (previous_parkrun != null && day_month == "01/01/" && parkrun_event.date == previous_parkrun.date) {

            o.subparts_detail.push({
                "name": parkrun_event.name+" i "+previous_parkrun.name,
                "date": parkrun_event.date,
                "info": parkrun_event.date,
                "subpart": o.subparts_detail.length + 1
            })

            // Add to the events done list, so that we can map them
            if (!(parkrun_event.name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
            }
            if (!(previous_parkrun.name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[previous_parkrun.name] = get_parkrun_event_details(data, previous_parkrun.name)
            }

            o.subparts_completed_count += 1
            // Mark it complete the first time it occurs
            if (!o.complete) {
                o.complete = true
                o.completed_on = parkrun_event.date
            }

        }

        previous_parkrun = parkrun_event

    });

    if (o.subparts_detail.length == 0) {
        o.subparts_detail.push({
            "subpart": o.subparts_detail.length + 1,
            "info": "-"
        })
    }

    // Change the summary to indicate number of times completed
    if (o.subparts_completed_count > 0) {
        o.summary_text = "x"+o.subparts_completed_count
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

function challenge_habitual(data, params) {
  var parkrun_results = data.parkrun_results
  var o = create_data_object(params, "runner")
  o.complete = false
  o.subparts = ["1"]
  o.summary_text = "0"
  var positionCounts = {}
  parkrun_results.forEach(function (parkrun_event) {
      if (o.subparts_detail.length == 0) {
          var positionCount = positionCounts[parkrun_event.position]
          if (positionCount === undefined)
              positionCounts[parkrun_event.position] = 1
          else
              positionCounts[parkrun_event.position] = positionCount + 1
          if (positionCount == 9) { // now 10
              o.subparts_detail.push({
                  "name": "Miejsce: " + parkrun_event.position,
                  "date": parkrun_event.date,
                  "info": parkrun_event.date,
                  "subpart": "10x"
              })
              o.subparts_completed_count = 1
              o.summary_text = "x1"
              o.complete = true
              o.completed_on = parkrun_event.date
          }

      }
  })

  var highestCount = 0
  var highestPosition = 0
  if (!o.complete) {
      for (var position in positionCounts) {
          if (positionCounts[position] > highestCount) {
              highestCount = positionCounts[position]
              highestPosition = position
          }
      }
  }

  if (o.subparts_detail.length == 0) {
      o.subparts_detail.push({
          "name": "Miejce: " + highestPosition,
          "subpart": highestCount + "x",
          "date": "-",
          "info": "-"
      })
  }

  return update_data_object(o)
}

function challenge_groundhog_day(data, params) {

  var parkrun_results = data.parkrun_results
    var o = create_data_object(params, "runner")
    o.subparts = ["1"]
    o.summary_text = "0"
    o.has_map = true
    if (has_home_parkrun(data) && is_our_page(data)) {
      o.home_parkrun = get_home_parkrun(data)
    }

    var previous_parkrun = null

    parkrun_results.forEach(function (parkrun_event) {

        if (previous_parkrun != null && parkrun_event.time == previous_parkrun.time && parkrun_event.name == previous_parkrun.name) {

            o.subparts_detail.push({
                "name": parkrun_event.name,
                "date": previous_parkrun.date+" i "+parkrun_event.date,
                "info": parkrun_event.time+" w dniach: "+previous_parkrun.date+" i "+parkrun_event.date,
                "subpart": o.subparts_detail.length + 1
            })

            // Add to the events done list, so that we can map them
            if (!(parkrun_event.name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
            }

            o.subparts_completed_count += 1
            // Mark it complete the first time it occurs
            if (!o.complete) {
                o.complete = true
                o.completed_on = parkrun_event.date
            }

        }

        previous_parkrun = parkrun_event

    });

    if (o.subparts_detail.length == 0) {
        o.subparts_detail.push({
            "subpart": o.subparts_detail.length + 1,
            "info": "-"
        })
    }

    // Change the summary to indicate number of times completed
    if (o.subparts_completed_count > 0) {
        o.summary_text = "x"+o.subparts_completed_count
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

function challenge_in_a_year(data, params) {

    var parkrun_results = data.parkrun_results
    var count = params.data

    var o = create_data_object(params, "runner")
    o.subparts = ["1"]
    o.summary_text = "0"

    by_year = {}

    parkrun_results.forEach(function (parkrun_event) {
        // Take the first 6 characters of the date to get the '01/01/' part
        year = parkrun_event.date.substr(6, 4)

        if (!(year in by_year)) {
            by_year[year] = []
        }

        by_year[year].push(parkrun_event)

    })

    Object.keys(by_year).sort().forEach(function (year) {
        if (by_year[year].length >= count) {
            o.subparts_detail.push({
                "name": year,
                "date": year,
                "info": by_year[year].length,
                "subpart": count+"+"
            })
            o.subparts_completed_count += 1
            if (!o.complete) {
                o.complete = true
                o.completed_on = year
            }
        }
    })

    if (o.subparts_detail.length == 0) {
        o.subparts_detail.push({
            "subpart": count+"+",
            "info": "-"
        })
    }

    // Change the summary to indicate number of times completed
    if (o.subparts_completed_count > 0) {
        o.summary_text = "x"+o.subparts_completed_count
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

function unroll_regions(sorted_region_heirachy) {

  summary = {}
  iterate_unroll_regions(summary, sorted_region_heirachy, 0)
  return summary

}

function iterate_unroll_regions(summary, region, parent_id) {

  summary[region.id] = {
    name: region.name,
    parent_id: parent_id,
    complete: region.complete,
    completed_on: region.completed_on,
    child_regions: region.child_regions.map(r => r.id),
    child_events: region.child_events,
    child_events_completed: region.child_events_completed,
    // Recursive data, for all child regions and their children, downloads
    recursive_child_events_completed: region.child_events_completed_count,
    recursive_child_events_count: region.child_events_total,
  }
  region.child_regions.forEach(function(sub_region) {
    iterate_unroll_regions(summary, sub_region, region.id)
  })

}

function calculate_child_regions(regions, events_completed_map, parent_region) {

    var region_info = {
        'name': parent_region,
        "id": regions[parent_region]["id"],
        "complete": false,
        "completed_on": null,
        "child_regions": [],
        "child_events": [],
        "child_events_total": 0,
        "child_events_completed": {},
        "child_events_completed_count": 0,
        "first_ran_on": null
    }

    // child_region_info = []
    if (regions[parent_region].child_region_names.length == 0) {
        // No sub regions
    } else {
        regions[parent_region].child_region_names.sort().forEach(function (region_name) {
            child_region_parkrun_info = calculate_child_regions(regions, events_completed_map, region_name)
            region_info["child_regions"].push(child_region_parkrun_info)
            region_info["child_events_total"] += child_region_parkrun_info["child_events_total"]
            region_info["child_events_completed_count"] += child_region_parkrun_info["child_events_completed_count"]
            if (region_info.first_ran_on == null ||
                (child_region_parkrun_info.first_ran_on != null &&
                    child_region_parkrun_info.first_ran_on < region_info.first_ran_on)) {
                region_info.first_ran_on = child_region_parkrun_info.first_ran_on
            }
            // child_region_info.push(child_region_parkrun_info)
        })
    }

    region_info["child_events_total"] += regions[parent_region].child_event_names.length
    if (regions[parent_region].child_event_names.length > 0) {
        regions[parent_region].child_event_names.sort().forEach(function (event_name) {
            // Work out if we have completed this parkrun
            // Lets just say yes for now
            region_info["child_events"].push(event_name)
            if (event_name in events_completed_map) {
                region_info["child_events_completed_count"] += 1
                // Add the first completed run at this event to our list
                region_info["child_events_completed"][event_name] = events_completed_map[event_name][0]
                first_run_date = events_completed_map[event_name][0].date_obj
                if (region_info.first_ran_on == null ||
                    first_run_date < region_info.first_ran_on) {
                    region_info.first_ran_on = first_run_date
                }
            }
        })
    }

    // Now that we have processed everything below, see if we have completed
    // this region
    region_info["complete"] = (region_info["child_events_completed_count"] == region_info["child_events_total"])

    return region_info

}

function generate_regionnaire_detail_info(region, depth) {
    var details = []

    prefix = Array(depth).join("- ")

    if (region["child_events_total"] > 0) {
        details.push({
                "subpart": prefix + region["name"],
                "info": region["child_events_completed_count"] + "/" + region["child_events_total"],
                "complete": region["child_events_completed_count"] == region["child_events_total"],
                "completed_on": null
        })
    }

    region["child_regions"].forEach(function(child_region) {
        sub_region_info = generate_regionnaire_detail_info(child_region, depth+1);
        sub_region_info.forEach(function (array_entry) {
            details.push(array_entry)
        })
    })

    return details
}

function challenge_by_region(data, params) {

  var parkrun_results = data.parkrun_results
  var geo_data = data.geo_data

    var o = create_data_object(params, "runner")
    o.summary_text = ""

    regions = geo_data.data.regions
    // Sort all of the completed parkruns by event so that we can pick out which
    // has been run, and when that was
    o.events_completed_map = group_results_by_event(parkrun_results)
    sorted_region_heirachy = calculate_child_regions(regions, o.events_completed_map, "World")
    // console.log(sorted_region_heirachy)

    o.regions = sorted_region_heirachy

    o.unrolled_regions = unroll_regions(sorted_region_heirachy)

    o.subparts_detail = generate_regionnaire_detail_info(sorted_region_heirachy, 0)

    // Work out of any regions have been completed
    o.subparts_detail.forEach(function (detail) {
        if (detail.complete) {
            o.subparts_completed_count += 1
            o.complete = true
        }
    })

    if (o.subparts_completed_count > 0) {
        o.summary_text = "x"+o.subparts_completed_count
    }

    // Return an object representing this challenge
    return update_data_object(o)
}
