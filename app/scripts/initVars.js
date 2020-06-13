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
        x: 200,
        y: 200,
        load: 40,
        angle: 180
    },
    {
        x: 200,
        y: 100,
        load: 20,
        angle: 90
    },
    {
        x: 0,
        y: 0,
        support: 'fixed'
    },
    {
      x: 400,
      y: 0,
      support: 'vrolling'
    }
];

var initElements = [
    {
        'startNode': '0',
        'endNode': '1'
    },
    {
        'startNode': '0',
        'endNode': '2'
    },
    {
        'startNode': '0',
        'endNode': '3'
    },
    {
        'startNode': '1',
        'endNode': '3'
    },
    {
        'startNode': '1',
        'endNode': '2'
    }
]