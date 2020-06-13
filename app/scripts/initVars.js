var initSupports = [
    {
        label: 'None',
        value: null
    },
    {
        label: 'Fixed',
        value: 'fixed'
    },
    {
        label: 'Vert rolling',
        value: 'vrolling'
    },
    {
        label: 'Horiz rolling',
        value: 'hrolling'
    }
];
  
var initNodes = [
    {
        x: 2,
        y: 2,
        load: 40,
        angle: 180
    },
    {
        x: 2,
        y: 1,
        load: 20,
        angle: 90
    },
    {
        x: 0,
        y: 0,
        support: 'fixed'
    },
    {
      x: 4,
      y: 0,
      support: 'vrolling'
    }
];

var initElements = [
    {
        'startNode': '0',
        'endNode': '1',
        'area': 4,
        'material': '205939650'
    },
    {
        'startNode': '0',
        'endNode': '2',
        'area': 3,
        'material': '205939650'
    },
    {
        'startNode': '0',
        'endNode': '3',
        'area': 3,
        'material': '205939650'
    },
    {
        'startNode': '1',
        'endNode': '3',
        'area': 3,
        'material': '205939650'
   },
    {
        'startNode': '1',
        'endNode': '2',
        'area': 3,
        'material': '205939650'
    }
];

var initMaterials = [
    {
        'label': 'Hard wood',
        'value': 11522813.75
    },
    {
        'label': 'Soft wood',
        'value': 49523582.5
    },
    {
        'label': 'Steel',
        'value': 205939650
    },
    {
        'label': 'Aluminum',
        'value': 68646550
    },
    {
        'label': 'Furnice Iron',
        'value': 98066500
    },
    {
        'label': 'Concrete 10Mpa',
        'value': 21084297.5
    },
    {
        'label': 'Concrete 12Mpa',
        'value': 23535960
    },
    {
        'label': 'Concrete 16Mpa',
        'value': 26968287.5
    },
    {
        'label': 'Concrete 20Mpa',
        'value': 29419950
    },
    {
        'label': 'Concrete 30Mpa',
        'value': 33342610
    },
    {
        'label': 'Concrete 40Mpa',
        'value': 36284605
    },
    {
        'label': 'Concrete 50Mpa',
        'value': 38245935
    }
];